import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { disconnectPrisma } from "./db/prisma.js";

const app = buildApp();

try {
  await app.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await app.close();
    await disconnectPrisma();
    process.exit(0);
  });
}
