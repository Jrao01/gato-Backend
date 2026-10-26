import { z } from "zod";

export const createEntitySchema = z.object({
  name: z.string().trim().min(2).max(120),
  rifCedula: z.string().trim().max(30).optional(),
  type: z.string().trim().min(2).max(50),
  phone: z.string().trim().max(30).optional(),
});

export const updateEntitySchema = createEntitySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Al menos un campo a actualizar" },
);

export const entityIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
