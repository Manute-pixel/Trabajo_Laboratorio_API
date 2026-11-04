import z from "zod";
import {
    productoSchema,
    miProductoSchema,
    consultarProductoSchema,
    actualizarProductoSchema,
} from "../validators/productos.schemas.js";

//Filtros que se pueden utilizar para consultar productos
export const ConsultaProductos = {
    ...z.toJSONSchema(consultarProductoSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
};

//Respuesta que se obtiene al consultar un producto
export const Producto = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1
        },
        nombre_producto: {
            type: "string",
            example: "Poncho de lana"
        },
        descripcion: {
            type: "string"
        },
        precio_producto: {
            type: "number",
            example: 1500
        },
        categoriaId: {
            type: "integer",
            example: 1
        },
        artesanoId: {
            type: "integer",
            example: 1
        },
        createdAt: {
           type: "string",
           format: "date-time",
           example: "2026-08-20T12:00:00.000Z",
        },
        updatedAt: {
           type: "string",
           format: "date-time",
           example: "2026-08-20T12:00:00.000Z",
        },
    }
};

//Datos que se envían al crear un producto
export const MiProducto = {
  ...z.toJSONSchema(miProductoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre_producto: "Poncho de lana",
    descripcion: "Poncho tejido a mano con lana de oveja",
    precio_producto: 1500,
    categoriaId: 1,
  },
};

export const NuevoProducto = {
    ...z.toJSONSchema(productoSchema, {
        target: "openapi-3.0",
        io: "input",
    }),
    example: {
        nombre: "Poncho de lana",
        descripcion: "Poncho tejido a mano con lana de oveja",
        precio: 1500,
        categoriaId: 1,
        artesanoId: 1,
    },
};

export const ActualizarProducto = {
    ...z.toJSONSchema(actualizarProductoSchema, {
        target: "openapi-3.0",
        io: "input",
    }),
    example: {
        nombre: "Poncho de lana",
        descripcion: "Poncho tejido a mano con lana de oveja",
        precio: 1500,
        categoriaId: 1,
        artesanoId: 1,
    },
};