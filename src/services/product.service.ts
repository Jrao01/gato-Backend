import type { Product } from "@prisma/client";
import { ProductRepository } from "../repositories/product.repository.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { SupplierRepository } from "../repositories/supplier.repository.js";
import { ConflictError, NotFoundError } from "../utils/http-error.js";
import type { CreateProductInput, UpdateProductInput } from "../models/product.model.js";

export class ProductService {
  constructor(
    private readonly repository: ProductRepository = new ProductRepository(),
    private readonly categoryRepository: CategoryRepository = new CategoryRepository(),
    private readonly supplierRepository: SupplierRepository = new SupplierRepository(),
  ) {}

  async list(activeOnly = false): Promise<Product[]> {
    return this.repository.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: { category: true, supplier: true },
    });
  }

  async getById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) throw new NotFoundError("Producto");
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) throw new NotFoundError("Categoría");
    if (input.supplierId) {
      const supplier = await this.supplierRepository.findById(input.supplierId);
      if (!supplier) throw new NotFoundError("Proveedor");
    }
    if (input.barcode) {
      const existing = await this.repository.findByBarcode(input.barcode);
      if (existing) throw new ConflictError("Ya existe un producto con ese código de barras");
    }
    const existingName = await this.repository.findByName(input.name);
    if (existingName) throw new ConflictError("Ya existe un producto con ese nombre");

    return this.repository.create({
      ...input,
      category: { connect: { id: input.categoryId } },
      supplier: input.supplierId ? { connect: { id: input.supplierId } } : undefined,
    });
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    await this.getById(id);
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) throw new NotFoundError("Categoría");
    }
    if (input.supplierId) {
      const supplier = await this.supplierRepository.findById(input.supplierId);
      if (!supplier) throw new NotFoundError("Proveedor");
    }
    if (input.barcode) {
      const existing = await this.repository.findByBarcode(input.barcode);
      if (existing && existing.id !== id) throw new ConflictError("Ya existe un producto con ese código de barras");
    }
    if (input.name) {
      const existing = await this.repository.findByName(input.name);
      if (existing && existing.id !== id) throw new ConflictError("Ya existe un producto con ese nombre");
    }

    return this.repository.update(id, {
      ...input,
      category: input.categoryId ? { connect: { id: input.categoryId } } : undefined,
      supplier: input.supplierId === null ? { disconnect: true } : input.supplierId ? { connect: { id: input.supplierId } } : undefined,
    });
  }

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}
