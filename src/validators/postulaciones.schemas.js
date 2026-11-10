import z from "zod";

export const postulacionSchema = z
  .object({
    artesanoId: z.coerce.number().int().positive(),
    edicionId: z.coerce.number().int().positive(),
  })
  .strict();

export const actualizarPostulacionSchemaAdmin = z
  .object({
    estado: z
      .enum(["pendiente", "aceptado", "rechazado", "corregir"])
      .transform((e) => e.toUpperCase()),
  })
  .strict();

export const actualizarPostulacionSchemaArtesano = z
  .object({
    edicionId: z.coerce.number().int().positive(),
  })
  .strict();

export const consultarPostulacionSchema = z
  .object({
    artesanoId: z.coerce.number().int().positive().optional(),
    edicionId: z.coerce.number().int().positive().optional(),
    estado: z
      .enum(["pendiente", "aceptado", "rechazado", "corregir"])
      .transform((e) => e.toUpperCase())
      .optional(),
    ordenPor: z
      .enum(["artesanoId", "edicionId", "estado"])
      .default("artesanoId"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

export const MipostulacionSchema = z
  .object({
    edicionId: z.coerce.number().int().positive(),
  })
  .strict();
