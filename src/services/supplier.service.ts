import type { Supplier } from "@prisma/client";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateSupplierInput, UpdateSupplierInput } from "../models/supplier.model.js";

export class SupplierService {
  constructor(private readonly repository: SupplierRepository = new SupplierRepository()) {}

  async list(): Promise<Supplier[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Supplier> {
    const supplier = await this.repository.findById(id);
    if (!supplier) throw new NotFoundError("Proveedor");
    return supplier;
  }

  async create(input: CreateSupplierInput): Promise<Supplier> {
    if (input.rif) {
      const existing = await this.repository.findByRif(input.rif);
      if (existing) throw new ConflictError("Ya existe un proveedor con ese RIF");
    }
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateSupplierInput): Promise<Supplier> {
    await this.getById(id);
    if (input.rif) {
      const existing = await this.repository.findByRif(input.rif);
      if (existing && existing.id !== id) {
        throw new ConflictError("Ya existe un proveedor con ese RIF");
      }
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
