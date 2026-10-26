import { z } from "zod";

export const createExchangeRateSchema = z.object({
  date: z.string().date(),
  rate: z.number().positive(),
});

export const updateExchangeRateSchema = createExchangeRateSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Al menos un campo a actualizar" },
);

export const exchangeRateIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateExchangeRateInput = z.infer<typeof createExchangeRateSchema>;
export type UpdateExchangeRateInput = z.infer<typeof updateExchangeRateSchema>;
