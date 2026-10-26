import { prisma } from "../db/prisma.js";
import type { Person, Prisma } from "@prisma/client";

export class PersonRepository {
  async findMany(): Promise<Person[]> {
    return prisma.person.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string): Promise<Person | null> {
    return prisma.person.findUnique({ where: { id } });
  }

  async findByCi(ci: string): Promise<Person | null> {
    return prisma.person.findUnique({ where: { ci } });
  }

  async create(data: Prisma.PersonCreateInput): Promise<Person> {
    return prisma.person.create({ data });
  }

  async update(id: string, data: Prisma.PersonUpdateInput): Promise<Person> {
    return prisma.person.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Person> {
    return prisma.person.delete({ where: { id } });
  }
}
