import z from "zod";

export const usuarioSchema = z.object({
    nombre: z.string().trim().min(2, "Debe tener al menos 2 caracteres"),
    apellido: z.string().trim().min(2, "Debe tener al menos 2 caracteres"),
    email: z.email("El email no tiene un formato válido"),
    password: z.string().min(8, "Debe tener al menos 8 caracteres"),
    rol_usuario: z
        .string()
        .trim()
        .transform((value) => value.toLowerCase())
        .pipe(z.enum(['administrador', 'artesano', 'operador']))
});

export const inicioSesionSchema = z.object({
    email: z.email("El email no tiene un formato válido."),
    password: z.string().min(1, "La contraseña es obligatoria.")
});