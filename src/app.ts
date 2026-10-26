import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { apiRoutes } from "./routes/index.js";
import { prisma } from "./db/prisma.js";

export function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === "development"
      ? { transport: undefined, level: "info" }
      : { level: env.NODE_ENV === "test" ? "silent" : "info" },
  });

  app.register(cors, { origin: env.CORS_ORIGIN });
  registerErrorHandler(app);

  app.get("/health", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "ok", db: "up" };
  });

  app.register(apiRoutes, { prefix: "/api/v1" });

  return app;
}
