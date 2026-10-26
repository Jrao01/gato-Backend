import type { FastifyReply, FastifyRequest } from "fastify";
import { ExchangeRateService } from "../services/exchange-rate.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  createExchangeRateSchema,
  exchangeRateIdParamSchema,
  updateExchangeRateSchema,
} from "../models/exchange-rate.model.js";

const service = new ExchangeRateService();

export class ExchangeRateController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  latest = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.getLatest();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = exchangeRateIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createExchangeRateSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const rate = await service.create(parsed.data);
    return reply.code(201).send(rate);
  };

  update = async (request: FastifyRequest) => {
    const { id } = exchangeRateIdParamSchema.parse(request.params);
    const parsed = updateExchangeRateSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = exchangeRateIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
