import { prisma } from "../db/prisma.js";
import type { Category, Prisma } from "@prisma/client";

export class CategoryRepository {
  async findMany(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { name } });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }
}
