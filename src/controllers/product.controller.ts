import type { FastifyReply, FastifyRequest } from "fastify";
import { ProductService } from "../services/product.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  createProductSchema,
  productIdParamSchema,
  updateProductSchema,
} from "../models/product.model.js";

const service = new ProductService();

export class ProductController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = productIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createProductSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const product = await service.create(parsed.data);
    return reply.code(201).send(product);
  };

  update = async (request: FastifyRequest) => {
    const { id } = productIdParamSchema.parse(request.params);
    const parsed = updateProductSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = productIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
