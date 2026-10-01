import z from "zod";

export const artesanoSchema = z.object({
    nombre: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
    apellido: z.string().trim().min(1, { message: "El apellido es obligatorio" }),
    dni: z.string().trim().min(7, { message: "El DNI es obligatorio" }),
    email: z.string().trim().min(1, { message: "El email es obligatorio" }),
    fechaNac: z.string()
        .transform((fecha) => new Date(fecha.replace(" ", "T")))
        .refine((fecha) => !isNaN(fecha.getTime()), {
            message: "Fecha inválida"
        }),
    rubro: z.string().trim().min(1, { message: "El rubro es obligatorio" }),
    localidad: z.string().trim().min(1, { message: "La localidad es obligatoria" }),
    provincia: z.string().trim().min(1, { message: "La provincia es obligatoria" })
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
    rubro: z.string().trim().optional(),
    localidad: z.string().trim().optional(),
    provincia: z.string().trim().optional(),
    ordenPor: z.enum(['nombre', 'apellido', 'dni','email', 'fechaNac', 'rubro', 'localidad', 'provincia']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
});