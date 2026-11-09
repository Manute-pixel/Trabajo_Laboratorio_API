import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { validarConsultaStands } from "../middlewares/validarConsultaStands.js";
import { validarCreacionStand } from "../middlewares/validarCreacionStand.js";
import {
  validarActualizacionStand,
  validarAsignacionStand,
} from "../middlewares/validarActualizacionStand.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";

//controllers:
import {
  obtenerStands,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand,
  asignarStand,
  desasignarStand,
} from "../controllers/stands.controller.js";

const router = express.Router();

const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

//rutas protegidas
router.post("/", 
  /*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Crear un stand"
    #swagger.description = "Registra un nuevo stand."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NuevoStand"
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Stand creado exitosamente"
    }

    #swagger.responses[400] = {
      description: "Los datos enviados no son válidos"
    }

    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }
  */
  ...controlesAdministrador, validarCreacionStand, crearStand);

router.put(
  "/:id",
  /*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Actualizar un stand"
    #swagger.description = "Actualiza la información de un stand existente."
    #swagger.security = [{
       bearerAuth: []
    }]
    
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del stand que se quiere actualizar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ActualizarStand"
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Stand actualizado exitosamente"
    }

    #swagger.responses[404] = {
      description: "Stand no encontrado"
    }

    #swagger.responses[400] = {
      description: "Los datos enviados no son válidos"
    }

    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }
  */
  ...controlesAdministrador,
  validarId,
  validarActualizacionStand,
  actualizarStand,
);

router.delete("/:id", 
/*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Eliminar un stand"
    #swagger.description = "Elimina un stand utilizando su ID."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del stand que se quiere eliminar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[204] = {
      description: "Stand eliminado correctamente. La respuesta no contiene un cuerpo."
    }

    #swagger.responses[400] = {
      description: "El ID es inválido"
    }

    #swagger.responses[404] = {
      description: "No se encontró el stand"
    }

    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }

    #swagger.responses[500] = {
      description: "Error interno del servidor"
    }
  */  
...controlesAdministrador, validarId, eliminarStand);

router.patch(
  "/asignar-stand-artesano/:id",
  ...controlesAdministrador,
  validarId,
  validarAsignacionStand,
  asignarStand,
);
router.patch(
  "/desvincular-stand-artesano/:id",
  ...controlesAdministrador,
  validarId,
  desasignarStand,
);


//rutas publicas
router.get("/", 
  /*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Listar y buscar stands"
    #swagger.description = "Permite consultar stands aplicando filtros, ordenamiento y paginación."
    #swagger.security = []

    #swagger.parameters['numero'] = {
      in: "query",
      description: "Filtrar por número de stand",
      type: "integer"
    }

    #swagger.parameters['estado'] = {
      in: "query",
      description: "Filtrar por estado",
      type: "string"
    }

    #swagger.parameters['sectorId'] = {
      in: "query",
      description: "Filtrar por sector",
      type: "integer"
    }

    #swagger.parameters['artesanoId'] = {
      in: "query",
      description: "Filtrar por artesano",
      type: "integer"
    }
  
    #swagger.parameters['ordenPor'] = {
      in: "query",
      description: "Campo por el que se ordenan los resultados",
      type: "string",
      enum: ["numero", "estado", "sector", "artesano"]
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
  validarConsultaStands, obtenerStands);

router.get("/:id", 
  /*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Obtener un stand por su ID"
    #swagger.description = "Busca un stand utilizando su identificador."
    #swagger.security = []

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del stand',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Stand encontrado',
      schema: { $ref: '#/components/schemas/Stand' }
    }

    #swagger.responses[400] = {
      description: 'El ID es inválido'
    }

    #swagger.responses[404] = {
      description: 'No se encontró el stand'
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor'
    }
  */
  validarId, obtenerStandPorId);

export default router;
