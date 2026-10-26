import { prisma } from "../db/prisma.js";
import type { ExchangeRate, Prisma } from "@prisma/client";

export class ExchangeRateRepository {
  async findMany(): Promise<ExchangeRate[]> {
    return prisma.exchangeRate.findMany({ orderBy: { date: "asc" } });
  }

  async findById(id: string): Promise<ExchangeRate | null> {
    return prisma.exchangeRate.findUnique({ where: { id } });
  }

  async findByDate(date: Date): Promise<ExchangeRate | null> {
    return prisma.exchangeRate.findUnique({ where: { date } });
  }

  async findLatest(): Promise<ExchangeRate | null> {
    return prisma.exchangeRate.findFirst({ orderBy: { date: "desc" } });
  }

  async create(data: Prisma.ExchangeRateCreateInput): Promise<ExchangeRate> {
    return prisma.exchangeRate.create({ data });
  }

  async update(id: string, data: Prisma.ExchangeRateUpdateInput): Promise<ExchangeRate> {
    return prisma.exchangeRate.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ExchangeRate> {
    return prisma.exchangeRate.delete({ where: { id } });
  }
}
