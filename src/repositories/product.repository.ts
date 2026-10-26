import { prisma } from "../db/prisma.js";
import type { Product, Prisma } from "@prisma/client";

export class ProductRepository {
  async findMany(args?: Prisma.ProductFindManyArgs): Promise<Product[]> {
    return prisma.product.findMany({ ...args, orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Product | null> {
    return prisma.product.findFirst({ where: { name } });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { barcode } });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }
}
