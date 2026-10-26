import { z } from "zod";

export const createPersonSchema = z.object({
  name: z.string().trim().min(1).max(80),
  lastname: z.string().trim().min(1).max(80),
  ci: z.string().trim().min(1).max(30),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(255).optional(),
});

export const updatePersonSchema = createPersonSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Al menos un campo a actualizar" },
);

export const personIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
