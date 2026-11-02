import z from "zod";
import { artesanoSchema } from "./artesanos.schemas.js";

export const usuarioSchema = z.object({
    nombre: z.string().trim().min(2, "Debe tener al menos 2 caracteres"),
    apellido: z.string().trim().min(2, "Debe tener al menos 2 caracteres"),
    email: z.email("El email no tiene un formato válido"),
    password: z.string().min(8, "Debe tener al menos 8 caracteres"), 
});

export const inicioSesionSchema = z.object({
    email: z.email("El email no tiene un formato válido."),
    password: z.string().min(1, "La contraseña es obligatoria.")
});

export const usuarioIdParametrosSchema = z.object({ id: z.uuid() }).strict();

export const registroArtesanoSchema = usuarioSchema.extend(
    artesanoSchema.shape
).strict();

export const registrarAdminSchema = usuarioSchema.strict();

export const asignarArtesanoSchema = artesanoSchema
    .extend({ usuarioId: z.uuid() })
    .strict();