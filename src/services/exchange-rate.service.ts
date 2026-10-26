import type { ExchangeRate } from "@prisma/client";
import { ExchangeRateRepository } from "../repositories/exchange-rate.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateExchangeRateInput, UpdateExchangeRateInput } from "../models/exchange-rate.model.js";

export class ExchangeRateService {
  constructor(private readonly repository: ExchangeRateRepository = new ExchangeRateRepository()) {}

  async list(): Promise<ExchangeRate[]> {
    return this.repository.findMany();
  }

  async getLatest(): Promise<ExchangeRate> {
    const rate = await this.repository.findLatest();
    if (!rate) throw new NotFoundError("Tasa de cambio");
    return rate;
  }

  async getById(id: string): Promise<ExchangeRate> {
    const rate = await this.repository.findById(id);
    if (!rate) throw new NotFoundError("Tasa de cambio");
    return rate;
  }

  async create(input: CreateExchangeRateInput): Promise<ExchangeRate> {
    const date = new Date(input.date);
    const existing = await this.repository.findByDate(date);
    if (existing) throw new ConflictError("Ya existe una tasa para esa fecha");
    return this.repository.create({ date, rate: input.rate });
  }

  async update(id: string, input: UpdateExchangeRateInput): Promise<ExchangeRate> {
    await this.getById(id);
    return this.repository.update(id, {
      date: input.date ? new Date(input.date) : undefined,
      rate: input.rate,
    });
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
