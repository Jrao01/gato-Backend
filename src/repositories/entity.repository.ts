import { prisma } from "../db/prisma.js";
import type { Entity, Prisma } from "@prisma/client";

export class EntityRepository {
  async findMany(): Promise<Entity[]> {
    return prisma.entity.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<Entity | null> {
    return prisma.entity.findUnique({ where: { id } });
  }

  async findByRifCedula(rifCedula: string): Promise<Entity | null> {
    return prisma.entity.findUnique({ where: { rifCedula } });
  }

  async create(data: Prisma.EntityCreateInput): Promise<Entity> {
    return prisma.entity.create({ data });
  }

  async update(id: string, data: Prisma.EntityUpdateInput): Promise<Entity> {
    return prisma.entity.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Entity> {
    return prisma.entity.delete({ where: { id } });
  }
}
