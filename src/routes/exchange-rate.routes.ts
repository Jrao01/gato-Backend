import type { FastifyInstance } from "fastify";
import { ExchangeRateController } from "../controllers/exchange-rate.controller.js";

export async function exchangeRateRoutes(app: FastifyInstance): Promise<void> {
  const controller = new ExchangeRateController();

  app.get("/exchange-rates", controller.list);
  app.get("/exchange-rates/latest", controller.latest);
  app.get("/exchange-rates/:id", controller.getById);
  app.post("/exchange-rates", controller.create);
  app.patch("/exchange-rates/:id", controller.update);
  app.delete("/exchange-rates/:id", controller.remove);
}
