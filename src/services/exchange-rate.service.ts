import type { ExchangeRate } from "@prisma/client";
import { ExchangeRateRepository } from "../repositories/exchange-rate.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateExchangeRateInput, UpdateExchangeRateInput } from "../models/exchange-rate.model.js";

const EXTERNAL_RATE_URL = process.env.EXCHANGE_RATE_URL ?? "https://datos.cromstudio.com.ve/tasa";

interface ExternalRateResponse {
  fuente?: string;
  fecha_valor?: string;
  tasas?: { USD?: number; EUR?: number };
  actualizado_el?: string;
}

function toVenezuelaDate(date: Date): Date {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return new Date(`${year}-${month}-${day}T00:00:00-04:00`);
}

export class ExchangeRateService {
  constructor(private readonly repository: ExchangeRateRepository = new ExchangeRateRepository()) {}

  async list(): Promise<ExchangeRate[]> {
    await this.syncExternalRate().catch(() => undefined);
    return this.repository.findMany();
  }

  async getLatest(): Promise<ExchangeRate> {
    const synced = await this.syncExternalRate().catch(() => null);
    if (synced) return synced;

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

  private async syncExternalRate(): Promise<ExchangeRate> {
    const res = await fetch(EXTERNAL_RATE_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`External rate API responded ${res.status}`);

    const data = (await res.json()) as ExternalRateResponse;
    const usdRate = data.tasas?.USD;
    if (typeof usdRate !== "number" || !Number.isFinite(usdRate) || usdRate <= 0) {
      throw new Error("Invalid USD rate from external API");
    }

    const date = data.actualizado_el ? toVenezuelaDate(new Date(data.actualizado_el)) : toVenezuelaDate(new Date());
    return this.repository.upsertByDate(date, usdRate);
  }
}
