import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional(),
  rif: z.string().trim().max(30).optional(),
  address: z.string().trim().max(255).optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Al menos un campo a actualizar" },
);

export const supplierIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
