import type { FastifyInstance } from "fastify";
import { CategoryController } from "../controllers/category.controller.js";

export async function categoryRoutes(app: FastifyInstance): Promise<void> {
  const controller = new CategoryController();

  app.get("/categories", controller.list);
  app.get("/categories/:id", controller.getById);
  app.post("/categories", controller.create);
  app.patch("/categories/:id", controller.update);
  app.delete("/categories/:id", controller.remove);
}
