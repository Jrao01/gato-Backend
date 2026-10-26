import type { FastifyReply, FastifyRequest } from "fastify";
import { EntityService } from "../services/entity.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  createEntitySchema,
  entityIdParamSchema,
  updateEntitySchema,
} from "../models/entity.model.js";

const service = new EntityService();

export class EntityController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = entityIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createEntitySchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const entity = await service.create(parsed.data);
    return reply.code(201).send(entity);
  };

  update = async (request: FastifyRequest) => {
    const { id } = entityIdParamSchema.parse(request.params);
    const parsed = updateEntitySchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = entityIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
