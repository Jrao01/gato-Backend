import type { FastifyReply, FastifyRequest } from "fastify";
import { SaleService } from "../services/sale.service.js";
import { ValidationError } from "../utils/http-error.js";
import { createSaleSchema, saleIdParamSchema } from "../models/sale.model.js";

const service = new SaleService();

export class SaleController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = saleIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createSaleSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const sale = await service.create(parsed.data);
    return reply.code(201).send(sale);
  };
}
