import express from "express";
// middlewares
import { validarId } from "../middlewares/validarId.js";
import {
  validarPostulacion,
  validarMipostulacion,
} from "../middlewares/postulaciones.middlewares/validarPostulacion.js";
import { validarActualizacionPostulacion } from "../middlewares/postulaciones.middlewares/validarActualizacionPostulacion.js";
import { validarConsultaPostulacion } from "../middlewares/postulaciones.middlewares/validarConsultaPostulacion.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";

// controllers
import {
  obtenerPostulaciones,
  obtenerPostulacionPorId,
  crearPostulacion,
  actualizarPostulacion,
  crearMiPostulacion,
  obtenerMiPostulacion,
} from "../controllers/postulaciones.controller.js";

const router = express.Router();

const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

//rutas de administrador
router.get(
  "/",
  /*
    #swagger.tags = ["Postulaciones"]
    #swagger.summary = "Listar y buscar postulaciones"
    #swagger.description = "Permite consultar postulaciones aplicando filtros, ordenamiento y paginación."
    #swagger.security = [{
      "bearerAuth": []
    }]

    #swagger.parameters['artesanoId'] = {
      in: "query",
      description: "Filtrar por el id de un artesano",
      type: "integer"
    }

    #swagger.parameters['edicionId'] = {
      in: "query",
      description: "Filtrar por el id de una edición",
      type: "integer"
    }
  
    #swagger.parameters['estado_postulacion'] = {
      in: "query",
      description: "Filtrar por el estado de una postulación",
      type: "string"
    }
  
    #swagger.parameters['ordenPor'] = {
      in: "query",
      description: "Campo por el que se ordenan los resultados",
      type: "string",
      enum: ["artesanoId", "edicionId", "fecha_postulacion", "estado_postulacion"]
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
    
    #swagger.responses[401] = {
      description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
    }
  */
  ...controlesAdministrador,
  validarConsultaPostulacion,
  obtenerPostulaciones,
);

router.get(
  "/:id",
  /*
    #swagger.tags = ["Postulaciones"]
    #swagger.summary = "Obtener una postulación por su ID"
    #swagger.description = "Obtiene los detalles de una postulación específica utilizando su ID."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de la postulación que se quiere obtener',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Postulación encontrada',
      schema: { $ref: '#/components/schemas/Postulacion' }
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
  ...controlesAdministrador,
  validarId,
  obtenerPostulacionPorId,
);
  
  router.post(
    "/:id",
    /*
      #swagger.tags = ["Postulaciones"]
      #swagger.summary = "Crear una postulación"
      #swagger.description = "Registra una nueva postulación."
      #swagger.security = [{
         bearerAuth: []
      }]
      
      #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NuevaPostulacion"
          }
        }
      }
    }
     
      #swagger.responses[201] = {
        description: "Postulación creada exitosamente"
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
  validarPostulacion,
  crearPostulacion,
);

router.put(
  "/:id",
  /*
    #swagger.tags = ["Postulaciones"]
    #swagger.summary = "Actualizar una postulación"
    #swagger.description = "Actualiza la información de una postulación existente."
    #swagger.security = [{
       bearerAuth: []
    }]
    
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID de la postulación que se quiere actualizar',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/ActualizarPostulacion"
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "Postulación actualizada exitosamente"
    }

    #swagger.responses[404] = {
      description: "Postulación no encontrada"
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
  validarActualizacionPostulacion,
  actualizarPostulacion,
);

//rutas de artesano

//rutas protegidas
router.get(
  "/mi-postulacion",
  /*
   #swagger.tags = ['Postulaciones']
   #swagger.summary = 'Consultar mi postulación'
   #swagger.description = 'Permite al artesano autenticado consultar su postulación, incluyendo los datos de la edición y del artesano.'
  #swagger.security = [{ 
  "bearerAuth": [] 
  }]
  
  #swagger.responses[200] = {
    description: 'Postulación obtenida exitosamente',
    schema: { $ref: '#/definitions/MiPostulacion' }
  }

  #swagger.responses[401] = {
      description: "Cuenta inexistente o no autenticada"
    }

  #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ARTESANO"
    }

  #swagger.responses[404] = { 
  description: 'El artesano no tiene una postulación registrada' 
  }
 */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  obtenerMiPostulacion,
);
router.post(
  "/postularme",
  /*
    #swagger.tags = ["Postulaciones"]
    #swagger.summary = "Postularme a una edición"
    #swagger.description = "Permite a un artesano postularse a una edición."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/CrearMiPostulacion"
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Postulación creada exitosamente"
    }
    
    #swagger.responses[401] = {
      description: "Cuenta inexistente o no autenticada"
    }

    #swagger.responses[403] = {
      description: "Cuenta inactiva o el usuario no tiene el rol ARTESANO"
    }

    #swagger.responses[404] = {
      description: "Edición no encontrada"
    }

    #swagger.responses[400] = {
      description: "Datos inválidos"
    }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarMipostulacion,
  crearMiPostulacion,
);


export default router;
