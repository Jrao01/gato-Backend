import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const envFile = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(32).default("dev-only-secret-change-me-0123456789ab"),
  JWT_REFRESH_SECRET: z.string().min(32).default("dev-only-refresh-change-me-0123456789ab"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Variables de entorno inválidas:", parsed.error.issues);
  process.exit(1);
}

export const env = parsed.data;
