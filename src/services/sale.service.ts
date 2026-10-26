import { Prisma } from "@prisma/client";
import type { Sale } from "@prisma/client";
import { SaleRepository } from "../repositories/sale.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ExchangeRateRepository } from "../repositories/exchange-rate.repository.js";
import { PersonRepository } from "../repositories/person.repository.js";
import { NotFoundError, ValidationError } from "../utils/http-error.js";
import { prisma } from "../db/prisma.js";
import type { CreateSaleInput } from "../models/sale.model.js";

interface SaleItemCalc {
  productId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  priceType: "DETAL" | "MAYOR";
  costAtSale: Prisma.Decimal;
  profitUsd: Prisma.Decimal;
  profitVes: Prisma.Decimal;
  profitMargin: Prisma.Decimal;
  lineTotalUsd: Prisma.Decimal;
}

export class SaleService {
  constructor(
    private readonly repository: SaleRepository = new SaleRepository(),
    private readonly productRepository: ProductRepository = new ProductRepository(),
    private readonly exchangeRateRepository: ExchangeRateRepository = new ExchangeRateRepository(),
    private readonly personRepository: PersonRepository = new PersonRepository(),
  ) {}

  async list(): Promise<Sale[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Sale> {
    const sale = await this.repository.findById(id);
    if (!sale) throw new NotFoundError("Venta");
    return sale;
  }

  async create(input: CreateSaleInput): Promise<Sale> {
    if (input.paymentMethod === "CREDITO" && !input.personId) {
      throw new ValidationError([{ path: ["personId"], message: "El fiado requiere una persona" }]);
    }

    if (input.personId) {
      const person = await this.personRepository.findById(input.personId);
      if (!person) throw new NotFoundError("Persona");
    }

    const exchangeRate = await this.exchangeRateRepository.findLatest();
    if (!exchangeRate) throw new NotFoundError("Tasa de cambio");

    const rate = exchangeRate.rate;
    const productIds = [...new Set(input.items.map((i) => i.productId))];
    const products = await Promise.all(productIds.map((id) => this.productRepository.findById(id)));
    const productMap = new Map(products.map((p) => (p ? [p.id, p] : null)).filter(Boolean) as [string, typeof products[0]][]);

    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) throw new NotFoundError("Producto");
      if (product.stock.lessThan(item.quantity)) {
        throw new ValidationError([{ path: ["items"], message: `Stock insuficiente para ${product.name}` }]);
      }
    }

    const saleItems: SaleItemCalc[] = input.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = item.priceType === "MAYOR" ? product.wholesalePrice : product.retailPrice;
      const lineTotalUsd = unitPrice.mul(item.quantity);
      const costAtSale = product.costPrice;
      const profitUsd = lineTotalUsd.sub(costAtSale.mul(item.quantity));
      const profitVes = profitUsd.mul(rate);
      const profitMargin = lineTotalUsd.greaterThan(0) ? profitUsd.mul(100).div(lineTotalUsd) : new Prisma.Decimal(0);

      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        priceType: item.priceType,
        costAtSale,
        profitUsd,
        profitVes,
        profitMargin,
        lineTotalUsd,
      };
    });

    const subtotalUsd = saleItems.reduce((acc, item) => acc.add(item.lineTotalUsd), new Prisma.Decimal(0));
    const totalUsd = subtotalUsd;
    const totalVes = totalUsd.mul(rate);

    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          userId: input.userId,
          personId: input.personId,
          paymentMethod: input.paymentMethod,
          exchangeRate: rate,
          subtotalUsd,
          totalUsd,
          totalVes,
          status: "COMPLETED",
          items: {
            create: saleItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              priceType: item.priceType,
              costAtSale: item.costAtSale,
              profitUsd: item.profitUsd,
              profitVes: item.profitVes,
              profitMargin: item.profitMargin,
            })),
          },
        },
        include: { items: { include: { product: true } }, person: true },
      });

      for (let i = 0; i < saleItems.length; i++) {
        const item = saleItems[i]!;
        const createdItem = sale.items[i]!;
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            userId: input.userId,
            quantity: new Prisma.Decimal(-item.quantity),
            type: "SALE",
            unitCostUsd: item.costAtSale,
            saleId: sale.id,
            saleItemId: createdItem.id,
          },
        });
      }

      if (input.paymentMethod === "CREDITO" && input.personId) {
        await tx.credit.create({
          data: {
            personId: input.personId,
            saleId: sale.id,
            amountUsd: totalUsd,
            amountBs: totalVes,
            balanceUsd: totalUsd,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
            status: "PENDING",
          },
        });
      }

      return sale;
    });
  }
}
