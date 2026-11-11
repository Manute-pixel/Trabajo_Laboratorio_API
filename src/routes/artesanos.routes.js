import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { validarConsultaArtesanos } from "../middlewares/artesanos.middlewares/validarConsultaArtesanos.js";
import { validarActualizacionArtesano } from "../middlewares/artesanos.middlewares/validarActualizacionArtesano.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

// controllers:
import {
  obtenerArtesanos,
  obtenerArtesanoPorId,
  actualizarArtesano,
  borrarArtesano,
  consultarMiArtesano,
} from "../controllers/artesanos.controller.js";

const router = express.Router();

const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];


//rutas protegidas:
//ruta protegida para consultar el perfil del artesano
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
      description: "Datos del artesano obtenidos correctamente",
      schema: {
       $ref: "#/components/schemas/MiArtesano"
      }
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
    
    #swagger.parameters['fechaNac'] = {
      in: "query",
      description: "Filtrar por fecha de nacimiento",
      type: "string",
      format: "date",
      example: "1990-05-20"
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

 // rutas protegidas para administradores dinamicas
 router.patch("/:id", 
  /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Actualizar un artesano"
    #swagger.description = "Actualiza los datos de un artesano existente."
    #swagger.security = [{
      bearerAuth: []
    }]

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
            $ref: "#/components/schemas/ActualizarArtesano"
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

    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }

    #swagger.responses[404] = {
      description: "No se encontró el artesano"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */
  ...controlesAdministrador,validarId, validarActualizacionArtesano, actualizarArtesano);

  
router.delete("/:id", 
  /*
    #swagger.tags = ["Artesanos"]
    #swagger.summary = "Eliminar un artesano"
    #swagger.description = "Elimina un artesano utilizando su ID."
    #swagger.security = [{
      bearerAuth: []
    }]

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del artesano que se quiere eliminar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[204] = {
      description: "Artesano desactivado correctamente. La respuesta no contiene un cuerpo."
    }

    #swagger.responses[400] = {
      description: "El ID es inválido"
    }

    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }

    #swagger.responses[404] = {
      description: "No se encontró el artesano"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */
  ...controlesAdministrador, validarId, borrarArtesano);

export default router;