import { prisma } from "../db/prisma.js";
import type { Prisma, Sale } from "@prisma/client";

export class SaleRepository {
  async findMany(args?: Prisma.SaleFindManyArgs): Promise<Sale[]> {
    return prisma.sale.findMany({
      ...args,
      include: { items: { include: { product: true } }, person: true, credit: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<Sale | null> {
    return prisma.sale.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, person: true, credit: true },
    });
  }

  async create(data: Prisma.SaleUncheckedCreateInput & { items: Prisma.SaleItemUncheckedCreateWithoutSaleInput[] }): Promise<Sale> {
    return prisma.sale.create({
      data: {
        ...data,
        items: { create: data.items },
      },
      include: { items: { include: { product: true } }, person: true, credit: true },
    });
  }
}
