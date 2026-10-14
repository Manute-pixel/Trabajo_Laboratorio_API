import z from "zod";

export const postulacionSchema = z.object({
  artesanoId: z.coerce.number().int().positive(),
  edicionId: z.coerce.number().int().positive(),
  estado: z.enum(["pendiente", "aceptada", "rechazada", "corregir"]),
});

export const actualizarPostulacionSchema = z.object({
  artesanoId: z.coerce.number().int().positive(),
  edicionId: z.coerce.number().int().positive(),
  estado: z.enum(["aceptada", "rechazada", "corregir"])
});

export const consultarPostulacionSchema = z.object({
    artesanoId: z.coerce.number().int().positive().optional(),
    edicionId: z.coerce.number().int().positive().optional(),
    estado: z.enum(["pendiente", "aceptada", "rechazada", "corregir"]).optional(),
    ordenPor: z.enum(['artesanoId', 'edicionId', 'estado']).default('artesanoId'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
});