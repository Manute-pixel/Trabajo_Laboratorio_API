import z from "zod";

export const artesanoSchema = z.object({
    nombre: z.string().trim().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    apellido: z.string().trim().min(3, { message: "El apellido debe tener al menos 3 caracteres" }),
    dni: z.string().trim().min(7, { message: "El DNI es obligatorio" }),
    email: z.email().toLowerCase().refine((email) => email.includes("@"), {
        message: "El email es inválido"
    }),
    fechaNac: z.string()
        .transform((fecha) => new Date(fecha.replace(" ", "T")))
        .refine((fecha) => !isNaN(fecha.getTime()), {
            message: "Fecha inválida"
        }),
    telefono: z.string().trim().min(10, { message: "El teléfono debe tener al menos 10 caracteres" }),
    rubroId: z.coerce.number().int().positive({ message: "El rubro es obligatorio" }),
    localidadId: z.coerce.number().int().positive({ message: "La localidad es obligatoria" }),
    provinciaId: z.coerce.number().int().positive({ message: "La provincia es obligatoria" })
});

export const consultarArtesanoSchema = z.object({
    nombre: z.string().trim().optional(),
    apellido: z.string().trim().optional(),
    dni: z.string().trim().optional(),
    email: z.email().trim().toLowerCase().optional(),
    fechaNac: z.string()
        .transform((fecha) => new Date(fecha.replace(" ", "T")))
        .refine((fecha) => !isNaN(fecha.getTime()), {
            message: "Fecha inválida"
        }).optional(),
    rubroId: z.coerce.number().int().positive().optional(),
    localidadId: z.coerce.number().int().positive().optional(),
    provinciaId: z.coerce.number().int().positive().optional(),
    ordenPor: z.enum(['nombre', 'apellido', 'dni','email', 'fechaNac', 'rubroId', 'localidadId', 'provinciaId']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
});