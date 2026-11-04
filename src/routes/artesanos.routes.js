import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { validarConsultaArtesanos } from "../middlewares/artesanos.middlewares/validarConsultaArtesanos.js";
import { validarArtesano } from "../middlewares/artesanos.middlewares/validarArtesano.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

// controllers:
import {
  obtenerArtesanos,
  obtenerArtesanoPorId,
  crearArtesano,
  actualizarArtesano,
  borrarArtesano,
  consultarMiArtesano,
} from "../controllers/artesanos.controller.js";
const router = express.Router();

//rutas publicas:
router.get("/", 
   /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Listar y buscar artesanos"
    #swagger.description = "Permite consultar artesanos aplicando filtros, ordenamiento y paginación."
    #swagger.security = []

    #swagger.parameters['nombre'] = {
      in: "query",
      description: "Filtrar por nombre",
      type: "string"
    }

    #swagger.parameters['apellido'] = {
      in: "query",
      description: "Filtrar por apellido",
      type: "string"
    }

    #swagger.parameters['dni'] = {
      in: "query",
      description: "Filtrar por DNI",
      type: "string"
    }

    #swagger.parameters['email'] = {
      in: "query",
      description: "Filtrar por email",
      type: "string"
    }

    #swagger.parameters['rubroId'] = {
      in: "query",
      description: "Filtrar por rubro",
      type: "integer"
    }

    #swagger.parameters['localidadId'] = {
      in: "query",
      description: "Filtrar por localidad",
      type: "integer"
    }

    #swagger.parameters['provinciaId'] = {
      in: "query",
      description: "Filtrar por provincia",
      type: "integer"
    }

    #swagger.parameters['ordenPor'] = {
      in: "query",
      description: "Campo por el que se ordenan los resultados",
      type: "string",
      enum: ["nombre", "apellido", "dni", "email", "fechaNac", "rubroId", "localidadId", "provinciaId"]
    }

    #swagger.parameters['direccion'] = {
      in: "query",
      description: "Sentido del ordenamiento",
      type: "string",
      enum: ["asc", "desc"]
    }

    #swagger.parameters['pagina'] = {
      in: "query",
      description: "Número de página",
      type: "integer",
      default: 1
    }

    #swagger.parameters['limite'] = {
      in: "query",
      description: "Cantidad de resultados por página, entre 1 y 50",
      type: "integer",
      default: 10
    }

    #swagger.responses[200] = {
      description: "Consulta realizada correctamente"
    }

    #swagger.responses[400] = {
      description: "Los filtros enviados no son válidos"
    }
  */
  validarConsultaArtesanos, obtenerArtesanos);


router.post("/", 
   /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Crear un artesano"
    #swagger.description = "Registra un nuevo artesano."
    #swagger.security = []

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NuevoArtesano"
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Artesano creado exitosamente"
    }

    #swagger.responses[400] = {
      description: "Los datos enviados no son válidos"
    }
  */
  validarArtesano, crearArtesano);


router.put("/:id", 
  /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Actualizar un artesano"
    #swagger.description = "Actualiza los datos de un artesano existente."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del artesano que se quiere actualizar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NuevoArtesano"
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Artesano actualizado correctamente",
      schema: {
        type: "object",
        properties: {
          mensaje: { type: "string" },
          artesano: {
            $ref: "#/components/schemas/Artesano"
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "El ID o los datos enviados no son válidos"
    }

    #swagger.responses[404] = {
      description: "No se encontró el artesano"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */
  validarId, validarArtesano, actualizarArtesano);


router.delete("/:id", 
  /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Eliminar un artesano"
    #swagger.description = "Elimina un artesano utilizando su ID."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del artesano que se quiere eliminar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[204] = {
      description: "Artesano eliminado correctamente. La respuesta no contiene un cuerpo."
    }

    #swagger.responses[400] = {
      description: "El ID es inválido"
    }

    #swagger.responses[404] = {
      description: "No se encontró el artesano"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */
  validarId, borrarArtesano);

//rutas protegidas:
router.get(
  "/me",
  /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Consultar mi perfil de artesano"
    #swagger.description = "Obtiene los datos del artesano asociado al usuario autenticado. Requiere el rol ARTESANO."

    #swagger.security = [{
      bearerAuth: []
    }]

    #swagger.responses[200] = {
      description: "Datos del artesano obtenidos correctamente"
    }

    #swagger.responses[401] = {
      description: "El usuario no está autenticado"
    }

    #swagger.responses[403] = {
      description: "El usuario no tiene el rol ARTESANO"
    }

    #swagger.responses[404] = {
      description: "El usuario autenticado no tiene un artesano asociado"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  consultarMiArtesano,
);

//ruta publica para obtener un artesano por su id
router.get("/:id", 
   /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Obtener un artesano por su ID"
    #swagger.description = "Busca un artesano utilizando su identificador."

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del artesano',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Artesano encontrado',
      schema: { $ref: '#/components/schemas/Artesano' }
    }

    #swagger.responses[400] = {
      description: 'El ID es inválido'
    }

    #swagger.responses[404] = {
      description: 'No se encontró el artesano'
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor'
    }
  */
  validarId, obtenerArtesanoPorId);

export default router;