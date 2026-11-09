import z from "zod";
import { postulacionSchema,
    consultarPostulacionSchema,
    MipostulacionSchema
 } from "../validators/postulaciones.schemas.js";

export const ConsultarPostulaciones = {
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
      example: 1,
    },
    artesanoId: {
      type: "integer",
      example: 1,
    },
    edicionId: {
      type: "integer",
      example: 1,
    },
    estado_postulacion: {
      type: "string",
      example: "PENDIENTE",
    },
  },
};

export const NuevaPostulacion = {
    ...z.toJSONSchema(postulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        artesanoId: 1,
        edicionId: 1
    }
};

export const ActualizarPostulacion = {
    ...z.toJSONSchema(postulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        artesanoId: 1,
        edicionId: 1,
        estado: "ACEPTADA"
    }
};

export const MiPostulacion = {
  type: "object",
  properties: {
    fecha_postulacion: {
      type: "string",
      format: "date-time",
      example: "2026-11-08T15:30:00.000Z",
    },
    estado_postulacion: {
      type: "string",
      example: "PENDIENTE",
    },
    edicion: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        nombre_edicion: { type: "string", example: "Fiesta Nacional del Poncho" },
        anio_edicion: { type: "integer", example: 2026 },
        fecha_inicio: { type: "string", format: "date", example: "2026-07-17" },
        fecha_fin: { type: "string", format: "date", example: "2026-07-26" },
        estado_edicion: { type: "string", example: "PLANIFICADA" },
      },
    },
    artesano: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        nombre_artesano: { type: "string", example: "María" },
        apellido_artesano: { type: "string", example: "Gómez" },
        dni: { type: "string", example: "30123456" },
        fecha_Nacimiento: { type: "string", format: "date", example: "1985-05-12" },
        rubroId: { type: "integer", example: 2 },
        localidadId: { type: "integer", example: 3 },
        provinciaId: { type: "integer", example: 1 },
        email_artesano: { type: "string", format: "email", example: "maria@gmail.com" },
        telefono_artesano: { type: "string", example: "3834123456" },
        usuarioId: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
      },
    },
  },
};

export const CrearMiPostulacion = {
    ...z.toJSONSchema(MipostulacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        edicionId: 1
    }
}