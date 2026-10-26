import type { Category } from "@prisma/client";
import { CategoryRepository } from "../repositories/category.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../models/category.model.js";

export class CategoryService {
  constructor(private readonly repository: CategoryRepository = new CategoryRepository()) {}

  async list(): Promise<Category[]> {
    return this.repository.findMany();
  }

  async getById(id: string): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) throw new NotFoundError("Categoría");
    return category;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.repository.findByName(input.name);
    if (existing) throw new ConflictError("Ya existe una categoría con ese nombre");
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    await this.getById(id);
    if (input.name) {
      const existing = await this.repository.findByName(input.name);
      if (existing && existing.id !== id) {
        throw new ConflictError("Ya existe una categoría con ese nombre");
      }
    }
    return this.repository.update(id, input);
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
