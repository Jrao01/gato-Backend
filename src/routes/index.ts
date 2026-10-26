import type { FastifyInstance } from "fastify";
import { categoryRoutes } from "./category.routes.js";
import { supplierRoutes } from "./supplier.routes.js";
import { entityRoutes } from "./entity.routes.js";
import { personRoutes } from "./person.routes.js";
import { productRoutes } from "./product.routes.js";
import { exchangeRateRoutes } from "./exchange-rate.routes.js";
import { saleRoutes } from "./sale.routes.js";

export async function apiRoutes(app: FastifyInstance): Promise<void> {
  await app.register(categoryRoutes);
  await app.register(supplierRoutes);
  await app.register(entityRoutes);
  await app.register(personRoutes);
  await app.register(productRoutes);
  await app.register(exchangeRateRoutes);
  await app.register(saleRoutes);
}
