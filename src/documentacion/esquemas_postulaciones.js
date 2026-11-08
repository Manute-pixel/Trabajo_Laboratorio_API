import z from "zod";
import { postulacionSchema,
    consultarPostulacionSchema,
    MipostulacionSchema
 } from "..validators/postulaciones.schemas.js";

export const consultarPostulaciones = {
    ...z.toJSONSchema(consultarPostulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    })
};

export const Postulacion = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1
        },
        artesanoId: {
            type: "integer",
            example: 1
        },
        edicionId: {
            type: "integer",
            example: 1
        },
        estado_postulacion: {
            type: "string",
            example: "PENDIENTE"
        }
    }
};

export const NuevaPostulacion = {
    ...z.toJSONSchema(postulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        artesanoId: 1,
        edicionId: 1,
        estado: "PENDIENTE"
    }
};

export const ObtenerMiPostulacion = {
    ...z.toJSONSchema(MipostulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    })
}