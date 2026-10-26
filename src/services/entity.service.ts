import type { Entity } from "@prisma/client";
import { EntityRepository } from "../repositories/entity.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateEntityInput, UpdateEntityInput } from "../models/entity.model.js";

export class EntityService {
  constructor(private readonly repository: EntityRepository = new EntityRepository()) {}

  async list(): Promise<Entity[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Entity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new NotFoundError("Entidad");
    return entity;
  }

  async create(input: CreateEntityInput): Promise<Entity> {
    if (input.rifCedula) {
      const existing = await this.repository.findByRifCedula(input.rifCedula);
      if (existing) throw new ConflictError("Ya existe una entidad con ese RIF/Cédula");
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateEntityInput): Promise<Entity> {
    await this.getById(id);
    if (input.rifCedula) {
      const existing = await this.repository.findByRifCedula(input.rifCedula);
      if (existing && existing.id !== id) {
        throw new ConflictError("Ya existe una entidad con ese RIF/Cédula");
      }
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
