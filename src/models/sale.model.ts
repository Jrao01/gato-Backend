import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  priceType: z.enum(["DETAL", "MAYOR"]),
});

export const createSaleSchema = z.object({
  userId: z.string().min(1),
  personId: z.string().optional(),
  paymentMethod: z.enum([
    "EFECTIVO_USD",
    "EFECTIVO_BS",
    "TRANSFERENCIA",
    "PUNTO_DE_NEGOCIO",
    "MIXTO",
    "CREDITO",
  ]),
  items: z.array(saleItemSchema).min(1),
  dueDate: z.string().datetime().optional(),
});

export const saleIdParamSchema = z.object({
  id: z.string().min(1),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;
