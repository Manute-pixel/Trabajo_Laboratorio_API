import z from "zod";
import {
  actualizarArtesanoSchema,
  consultarArtesanoSchema,
  artesanoSchema
} from "../validators/artesanos.schemas.js";

// Datos que se envían al crear o asignar un artesano
export const NuevoArtesano = {
  ...z.toJSONSchema(artesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "María",
    apellido: "Pérez",
    dni: "12345678",
    email: "maria@example.com",
    fechaNac: "1990-05-20",
    telefono: "3834123456",
    rubroId: 1,
    localidadId: 1,
    provinciaId: 1,
  },
};

// Datos que se envían al actualizar un artesano
export const ActualizarArtesano = {
  ...z.toJSONSchema(actualizarArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "María",
    telefono: "3834123456",
  },
};

// Filtros que se pueden utilizar para consultar artesanos
export const ConsultaArtesanos = {
  ...z.toJSONSchema(consultarArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
};

export const Artesano = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1,
    },
    nombre_artesano: {
      type: "string",
      example: "María",
    },
    apellido_artesano: {
      type: "string",
      example: "Gómez",
    },
    dni: {
      type: "string",
      example: "30123456",
    },
    fecha_Nacimiento: {
      type: "string",
      format: "date-time",
      example: "1990-05-20T00:00:00.000Z",
    },
    rubroId: {
      type: "integer",
      example: 2,
    },
    localidadId: {
      type: "integer",
      example: 3,
    },
    provinciaId: {
      type: "integer",
      example: 1,
    },
    email_artesano: {
      type: "string",
      format: "email",
      example: "maria@example.com",
    },
    telefono_artesano: {
      type: "string",
      example: "3834123456",
    },
    usuarioId: {
      type: "string",
      format: "uuid",
      example: "550e8400-e29b-41d4-a716-446655440000",
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

export const MiArtesano = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      example: 1
    },
    nombre_artesano: {
      type: "string",
      example: "María"
    },
    apellido_artesano: {
      type: "string",
      example: "Pérez"
    },
    dni: {
      type: "string",
      example: "30123456"
    },
    fecha_Nacimiento: {
      type: "string",
      format: "date-time",
      example: "1990-05-20T00:00:00.000Z"
    },
    email_artesano: {
      type: "string",
      format: "email",
      example: "maria@example.com"
    },
    telefono_artesano: {
      type: "string",
      example: "3834123456"
    },
    rubro: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1
        },
        nombre_rubro: {
          type: "string",
          example: "Cerámica"
        },
        descripcion: {
          type: "string",
          nullable: true,
          example: "Elaboración de piezas artesanales de cerámica"
        },
        createdAt: {
          type: "string",
          format: "date-time"
        },
        updatedAt: {
          type: "string",
          format: "date-time"
        }
      }
    },
    provincia: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1
        },
        nombre_provincia: {
          type: "string",
          example: "Catamarca"
        },
        createdAt: {
          type: "string",
          format: "date-time"
        },
        updatedAt: {
          type: "string",
          format: "date-time"
        }
      }
    },
    localidad: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          example: 1
        },
        nombre_localidad: {
          type: "string",
          example: "San Fernando del Valle de Catamarca"
        },
        createdAt: {
          type: "string",
          format: "date-time"
        },
        updatedAt: {
          type: "string",
          format: "date-time"
        }
      }
    },
    usuario: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
          example: "550e8400-e29b-41d4-a716-446655440000"
        },
        nombre_usuario: {
          type: "string",
          example: "María"
        },
        apellido_usuario: {
          type: "string",
          example: "Pérez"
        },
        email_usuario: {
          type: "string",
          format: "email",
          example: "maria@example.com"
        },
        roles: {
          type: "array",
          items: {
            type: "string",
            example: "ARTESANO"
          },
          example: ["ARTESANO", "ADMIN"]
        },
        activo: {
          type: "boolean",
          example: true
        },
        createdAt: {
          type: "string",
          format: "date-time"
        }
      }
    }
  }
};