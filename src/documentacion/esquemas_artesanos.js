import z from "zod";
import {
  actualizarArtesanoSchema,
  consultarArtesanoSchema,
} from "../validators/artesanos.schemas.js";

// Datos que se envían al actualizar un artesano
export const NuevoArtesano = {
  ...z.toJSONSchema(actualizarArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "María",
    apellido: "Pérez",
    dni: "12345678",
    email: "maria@example.com",
    fechaNac: "1990-05-20",
    telefono: "3834123456",
    rubroId: 1,
    localidadId: 1,
    provinciaId: 1,
  },
};

// Filtros que se pueden utilizar para consultar artesanos
export const ConsultaArtesanos = {
  ...z.toJSONSchema(consultarArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
};

export const Artesano = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    nombre_artesano: {
      type: "string",
      example: "María",
    },
    apellido_artesano: {
      type: "string",
      example: "Gómez",
    },
    dni: {
      type: "string",
      example: "30123456",
    },
    fecha_Nacimiento: {
      type: "string",
      format: "date",
      example: "1990-05-20",
    },
    rubroId: {
      type: "integer",
      example: 2,
    },
    localidadId: {
      type: "integer",
      example: 3,
    },
    provinciaId: {
      type: "integer",
      example: 1,
    },
    email_artesano: {
      type: "string",
      format: "email",
      example: "maria@example.com",
    },
    telefono_artesano: {
      type: "string",
      example: "3834123456",
    },
    usuarioId: {
      type: "string",
      format: "uuid",
      example: "550e8400-e29b-41d4-a716-446655440000",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      example: "2026-08-20T12:00:00.000Z",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      example: "2026-08-20T12:00:00.000Z",
    },
  },
};