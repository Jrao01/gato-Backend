import type { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller.js";

export async function productRoutes(app: FastifyInstance): Promise<void> {
  const controller = new ProductController();

  app.get("/products", controller.list);
  app.get("/products/:id", controller.getById);
  app.post("/products", controller.create);
  app.patch("/products/:id", controller.update);
  app.delete("/products/:id", controller.remove);
}
