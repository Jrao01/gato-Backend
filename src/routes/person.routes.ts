import type { FastifyInstance } from "fastify";
import { PersonController } from "../controllers/person.controller.js";

export async function personRoutes(app: FastifyInstance): Promise<void> {
  const controller = new PersonController();

  app.get("/persons", controller.list);
  app.get("/persons/:id", controller.getById);
  app.post("/persons", controller.create);
  app.patch("/persons/:id", controller.update);
  app.delete("/persons/:id", controller.remove);
}
