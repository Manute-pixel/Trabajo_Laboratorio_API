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
      description: "Stand creado exitosamente",
      schema: {
       $ref: "#/components/schemas/StandConArtesanoCompleto",
      },
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
      description: "Stand actualizado exitosamente",
      schema: {
       $ref: "#/components/schemas/StandConArtesanoCompleto",
      },
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
  /*
    #swagger.tags = ["Stands"]
    #swagger.summary = "Asignar stand a un artesano"
    #swagger.description = "Asigna un stand a un artesano específico."
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
            $ref: "#/components/schemas/AsignarStand"
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Stand asignado exitosamente",
      schema: {
       $ref: "#/components/schemas/StandAsignado",
      },
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
  validarAsignacionStand,
  asignarStand,
);

router.patch(
  "/desvincular-stand-artesano/:id",
  /* 
    #swagger.tags = ["Stands"]
    #swagger.summary = "Desasignar stand de un artesano"
    #swagger.description = "Desvincula al artesano asignado a un stand y cambia su estado a DISPONIBLE."
    #swagger.security = [{
      bearerAuth: []
    }]

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del stand que se quiere desvincular',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: "Stand actualizado exitosamente",
      schema: {
       $ref: "#/components/schemas/StandConArtesanoCompleto",
      },
    }

    #swagger.responses[400] = {
      description: "El stand no está asignado a ningún artesano"
    }

    #swagger.responses[404] = {
      description: "Stand no encontrado"
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
      description: "Filtrar por estado del stand",
      type: "string",
      enum: ["disponible", "ocupado"]
    }

    #swagger.parameters['sector'] = {
     in: "query",
     description: "Filtrar por nombre del sector",
     type: "string"
    }

    #swagger.parameters['pabellon'] = {
     in: "query",
     description: "Filtrar por nombre del pabellón",
     type: "string"
    }

    #swagger.parameters['edicion'] = {
     in: "query",
     description: "Filtrar por nombre de la edición",
     type: "string"
    }

    #swagger.parameters['artesano'] = {
     in: "query",
     description: "Filtrar por nombre del artesano",
     type: "string"
     }

    #swagger.parameters['fecha'] = {
     in: "query",
     description: "Filtrar por fecha exacta de creación del stand",
     type: "string",
     format: "date",
     example: "2026-11-09"
    }

    #swagger.parameters['fechaDesde'] = {
     in: "query",
     description: "Filtrar desde una fecha de creación",
     type: "string",
     format: "date",
     example: "2026-11-01"
    }

    #swagger.parameters['fechaHasta'] = {
     in: "query",
     description: "Filtrar hasta una fecha de creación",
     type: "string",
     format: "date",
     example: "2026-11-30"
    }

    #swagger.parameters['ordenPor'] = {
     in: "query",
     description: "Campo por el que se ordenan los resultados",
     type: "string",
     enum: ["numero", "estado", "sector", "pabellon", "edicion", "artesano", "fecha"],
     default: "fecha"
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
    description: "Listado de stands obtenido correctamente",
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
