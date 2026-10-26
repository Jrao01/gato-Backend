import type { FastifyReply, FastifyRequest } from "fastify";
import { CategoryService } from "../services/category.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "../models/category.model.js";

const service = new CategoryService();

export class CategoryController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = categoryIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createCategorySchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const category = await service.create(parsed.data);
    return reply.code(201).send(category);
  };

  update = async (request: FastifyRequest) => {
    const { id } = categoryIdParamSchema.parse(request.params);
    const parsed = updateCategorySchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = categoryIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
