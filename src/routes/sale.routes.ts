import type { FastifyInstance } from "fastify";
import { SaleController } from "../controllers/sale.controller.js";

export async function saleRoutes(app: FastifyInstance): Promise<void> {
  const controller = new SaleController();

  app.get("/sales", controller.list);
  app.get("/sales/:id", controller.getById);
  app.post("/sales", controller.create);
}
