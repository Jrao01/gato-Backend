import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(500).optional(),
  barcode: z.string().trim().max(50).optional(),
  categoryId: z.string().min(1),
  supplierId: z.string().optional(),
  unit: z.enum(["UNIDAD", "KG", "LITRO", "METRO", "PACK", "BOTELLA", "LATA", "SIXPACK", "CAJA", "BOLSA", "OTRO"]),
  costPrice: z.number().nonnegative(),
  wholesalePrice: z.number().nonnegative(),
  retailPrice: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  minStock: z.number().nonnegative(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Al menos un campo a actualizar" },
);

export const productIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
