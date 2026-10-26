import type { FastifyReply, FastifyRequest } from "fastify";
import { SupplierService } from "../services/supplier.service.js";
import { ValidationError } from "../utils/http-error.js";
import {
  createSupplierSchema,
  supplierIdParamSchema,
  updateSupplierSchema,
} from "../models/supplier.model.js";

const service = new SupplierService();

export class SupplierController {
  list = async (_request: FastifyRequest, _reply: FastifyReply) => {
    return service.list();
  };

  getById = async (request: FastifyRequest) => {
    const { id } = supplierIdParamSchema.parse(request.params);
    return service.getById(id);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = createSupplierSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    const supplier = await service.create(parsed.data);
    return reply.code(201).send(supplier);
  };

  update = async (request: FastifyRequest) => {
    const { id } = supplierIdParamSchema.parse(request.params);
    const parsed = updateSupplierSchema.safeParse(request.body);
    if (!parsed.success) throw new ValidationError(parsed.error.issues);
    return service.update(id, parsed.data);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = supplierIdParamSchema.parse(request.params);
    await service.remove(id);
    return reply.code(204).send();
  };
}
