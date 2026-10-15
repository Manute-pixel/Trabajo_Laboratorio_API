import {z} from 'zod';

export const standConsultaSchema = z.object({
    pagina: z.coerce.number().int().positive({ message: "La página debe ser un entero positivo" }).optional().default(1),
    limite: z.coerce.number().int().positive({ message: "El límite debe ser un entero positivo" }).optional().default(10),
    ordenPor: z.enum(["numero", "estado", "sector", "artesano"], { message: "El ordenPor debe ser 'numero', 'estado', 'sector' o 'artesano'" }).optional().default("numero"),
    direccion: z.enum(["asc", "desc"], { message: "La dirección debe ser 'asc' o 'desc'" }).optional().default("asc"),
    numero: z.coerce.number().int().positive({ message: "El número debe ser un entero positivo" }).optional(),
    estado: z.enum(["disponible", "ocupado"], { message: "El estado debe ser 'disponible' o 'ocupado'" }).optional(),
    sectorId: z.coerce.number().int().positive({ message: "El sectorId debe ser un entero positivo" }).optional(),
    artesanoId: z.coerce.number().int().positive({ message: "El artesanoId debe ser un entero positivo" }).optional()
});
export const standCreacionSchema = z.object({
    numero: z.coerce.number().int().positive({ message: "El número debe ser un entero positivo" }),
    estado: z.string().trim().toUpperCase().pipe(z.enum(["DISPONIBLE", "OCUPADO"], { message: "El estado debe ser 'disponible' o 'ocupado'" })),
    sectorId: z.coerce.number().int().positive({ message: "El sectorId debe ser un entero positivo" }),
});
export const standActualizacionSchema = z.object({
    numero: z.coerce.number().int().positive({ message: "El número debe ser un entero positivo" }),
    estado: z.string().trim().toUpperCase().pipe(z.enum(["DISPONIBLE", "OCUPADO"], { message: "El estado debe ser 'disponible' o 'ocupado'" })),
    sectorId: z.coerce.number().int().positive({ message: "El sectorId debe ser un entero positivo" }),
    artesanoId: z.coerce.number().int().positive({ message: "El artesanoId debe ser un entero positivo" })
});