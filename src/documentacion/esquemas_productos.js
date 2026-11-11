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
            type: "string",
            example: "Poncho tejido a mano con lana de oveja"
        },
        precio_producto: {
            type: "number",
            example: 1500
        },
        categoria: {
            type: "object",
            properties: {
                nombre_categoria: {
                    type: "string",
                    example: "Indumentaria"
                }
            }
        },
        artesano: {
            type: "object",
            properties: {
                nombre_artesano: {
                    type: "string",
                    example: "Juan"
                },
                apellido_artesano: {
                    type: "string",
                    example: "Pérez"
                },
                telefono_artesano: {
                    type: "string",
                    example: "3834000000"
                },
                rubro: {
                    type: "object",
                    properties: {
                        nombre_rubro: {
                            type: "string",
                            example: "Textilería"
                        }
                    }
                },
                localidad: {
                    type: "object",
                    properties: {
                        nombre_localidad: {
                            type: "string",
                            example: "San Fernando del Valle de Catamarca"
                        }
                    }
                },
                provincia: {
                    type: "object",
                    properties: {
                        nombre_provincia: {
                            type: "string",
                            example: "Catamarca"
                        }
                    }
                }
            }
        }
    }
};

//Datos que se envían al crear un producto propio
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

//Datos que se envían al crear un producto
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

export const MiProductoRespuesta = {
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
            type: "string",
            example: "Poncho tejido a mano con lana de oveja"
        },
        precio_producto: {
            type: "number",
            example: 1500
        },
        categoria: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    example: 1
                },
                nombre_categoria: {
                    type: "string",
                    example: "Indumentaria"
                }
            }
        },
        artesano: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    example: 1
                },
                nombre_artesano: {
                    type: "string",
                    example: "Juan"
                },
                apellido_artesano: {
                    type: "string",
                    example: "Pérez"
                },
                telefono_artesano: {
                    type: "string",
                    example: "3834000000"
                },
                dni: {
                    type: "string",
                    example: "30123456"
                }
            }
        }
    }
};