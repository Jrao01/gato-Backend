import type { FastifyInstance } from "fastify";
import { SupplierController } from "../controllers/supplier.controller.js";

export async function supplierRoutes(app: FastifyInstance): Promise<void> {
  const controller = new SupplierController();

  app.get("/suppliers", controller.list);
  app.get("/suppliers/:id", controller.getById);
  app.post("/suppliers", controller.create);
  app.patch("/suppliers/:id", controller.update);
  app.delete("/suppliers/:id", controller.remove);
}
