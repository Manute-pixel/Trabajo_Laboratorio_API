import z from "zod";
import {
    standConsultaSchema,
    standCreacionSchema,
    standActualizacionSchema,
} from "../validators/stand.schema.js";

export const ConsultaStands = {
    ...z.toJSONSchema(standConsultaSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
};

export const Stand = {
    type: "object",
    properties: {
        id:{
            type: "integer",
            example: 1
        },
        numero_stand: {
            type: "integer",
            example: 1
        },
        estado_stand:{
            type: "string",
            example: "DISPONIBLE"
        },
        sectorId: {
            type: "integer",
            example: 1
        },
        artesanoId: {
            type: "integer",
            example: 1
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
        }
    }
};

export const NuevoStand = {
  ...z.toJSONSchema(standCreacionSchema, {
    target: "openapi-3.0",
    io: "input"
  }),
  example: {
    numero_stand: 1,
    estado_stand: "DISPONIBLE",
    sectorId: 1,
  }
};

export const ActualizarStand = {
  ...z.toJSONSchema(standActualizacionSchema, {
    target: "openapi-3.0",
    io: "input"
  }),
  example: {
    numero_stand: 1,
    estado_stand: "OCUPADO",
    sectorId: 1,
    artesanoId: 1
  }
};