import z from "zod";

export const productoSchema = z.object({
    nombre: z.string().trim().min(1, { message: "El nombre del producto es requerido"}),
    descripcion: z.string().trim().min(1, {message: "La descripción no puede estar vacía"}).optional(),
    precio: z.coerce.number().int().min(0, { message: "El precio del producto debe ser un número entero positivo"}),
    categoriaId: z.coerce.number().int().min(1, { message: "La categoría del producto es requerida"}),
    artesanoId: z.coerce.number().int().min(1, { message: "El artesano del producto es requerido"})
})

export const consultarProductoSchema = z.object({
    nombre: z.string().trim().optional(),
    precioMin: z.coerce.number().int().min(0).optional(),
    precioMax: z.coerce.number().int().min(0).optional(),
    categoriaId: z.coerce.number().int().min(1).optional(),
    artesanoId: z.coerce.number().int().min(1).optional(),
    ordenPor: z.enum(['nombre', 'precio', 'categoriaId', 'artesanoId']).default('nombre'),
    direccion: z.enum(['asc', 'desc']).default('asc'),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10)
})

export const actualizarProductoSchema = z.object({
    nombre: z.string().trim().min(1, { message: "El nombre del producto es requerido" }).optional(),
    descripcion: z.string().trim().min(1, { message: "La descripción no puede estar vacía" }).optional(),
    precio: z.coerce.number().int().min(0, { message: "El precio del producto debe ser un número entero positivo" }).optional(),
    categoriaId: z.coerce.number().int().min(1, { message: "La categoría del producto es requerida" }).optional(),
    artesanoId: z.coerce.number().int().min(1, { message: "El artesano del producto es requerido" }).optional()
}).refine((producto) => Object.keys(producto).length > 0, {
    message: "Debe proporcionar al menos un atributo para actualizar"
})