import type { FastifyInstance } from "fastify";
import { EntityController } from "../controllers/entity.controller.js";

export async function entityRoutes(app: FastifyInstance): Promise<void> {
  const controller = new EntityController();

  app.get("/entities", controller.list);
  app.get("/entities/:id", controller.getById);
  app.post("/entities", controller.create);
  app.patch("/entities/:id", controller.update);
  app.delete("/entities/:id", controller.remove);
}
