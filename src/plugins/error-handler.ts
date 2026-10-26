import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/http-error.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof ZodError) {
      return reply.code(422).send({
        error: "VALIDATION_ERROR",
        message: "Datos inválidos",
        details: error.issues,
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.code(409).send({
          error: "CONFLICT",
          message: "Ya existe un registro con ese valor único",
        });
      }
      if (error.code === "P2003") {
        return reply.code(409).send({
          error: "CONFLICT",
          message: "Operación bloqueada: el registro está referenciado por otros datos",
        });
      }
    }

    app.log.error(error);
    return reply.code(500).send({ error: "INTERNAL_ERROR", message: "Error interno del servidor" });
  });

  app.setNotFoundHandler((_request, reply) => {
    return reply.code(404).send({ error: "NOT_FOUND", message: "Ruta no encontrada" });
  });
}
