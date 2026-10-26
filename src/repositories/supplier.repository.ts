import { prisma } from "../db/prisma.js";
import type { Supplier, Prisma } from "@prisma/client";

export class SupplierRepository {
  async findMany(): Promise<Supplier[]> {
    return prisma.supplier.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async findByRif(rif: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({ where: { rif } });
  }

  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return prisma.supplier.create({ data });
  }

  async update(id: string, data: Prisma.SupplierUpdateInput): Promise<Supplier> {
    return prisma.supplier.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Supplier> {
    return prisma.supplier.delete({ where: { id } });
  }
}
