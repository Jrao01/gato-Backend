import type { FastifyReply, FastifyRequest } from "fastify";
import { PersonService } from "../services/person.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  createPersonSchema,
  personIdParamSchema,
  updatePersonSchema,
} from "../models/person.model.js";

const service = new PersonService();

export class PersonController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = personIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createPersonSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const person = await service.create(parsed.data);
    return reply.code(201).send(person);
  };

  update = async (request: FastifyRequest) => {
    const { id } = personIdParamSchema.parse(request.params);
    const parsed = updatePersonSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = personIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
