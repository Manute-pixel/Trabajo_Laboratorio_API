import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

// controllers:
import {
    obtenerTotalArtesanos,
    obtenerArtesanosLocalidad,
    obtenerArtesanosRubro,
    obtenerReporteStands,
    obtenerProductoArtesano
} from "../controllers/reportes.controller.js";
const router = express.Router();

const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

// Rutas de reportes artesanos
router.get('/artesano', 
  /*
        #swagger.tags = ['Reportes']
        #swagger.summary = 'Obtener total de artesanos'
        #swagger.description = 'Obtiene la cantidad total de artesanos registrados en el sistema.'

        #swagger.responses[200] = {
            description: 'Total de artesanos obtenido correctamente',
            schema: { $ref: '#/components/schemas/TotalArtesanos' }
        }

          #swagger.responses[401] = {
            description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
        }

        #swagger.responses[403] = {
           description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
        }
           
        #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
  */
  ...controlesAdministrador, obtenerTotalArtesanos);

router.get('/artesano-localidad', 
  /*
        #swagger.tags = ['Reportes']
        #swagger.summary = 'Obtener artesanos por localidad'
        #swagger.description = 'Obtiene la cantidad de artesanos registrados en cada localidad.'

        #swagger.responses[200] = {
            description: 'Reporte de artesanos por localidad obtenido correctamente',
            schema: { $ref: '#/components/schemas/ArtesanosPorLocalidad' }
        }

         #swagger.responses[401] = {
            description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
        }

        #swagger.responses[403] = {
           description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
  */
  ...controlesAdministrador, obtenerArtesanosLocalidad);

router.get('/artesano-rubro', 
  /*
        #swagger.tags = ['Reportes']
        #swagger.summary = 'Obtener artesanos por rubro'
        #swagger.description = 'Obtiene la cantidad de artesanos registrados en cada rubro.'

        #swagger.responses[200] = {
            description: 'Reporte de artesanos por rubro obtenido correctamente',
            schema: { $ref: '#/components/schemas/ArtesanosPorRubro' }
        }

         #swagger.responses[401] = {
            description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
        }

        #swagger.responses[403] = {
           description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
  */
  ...controlesAdministrador, obtenerArtesanosRubro);

router.get('/producto-artesano', 
  /*
        #swagger.tags = ['Reportes']
        #swagger.summary = 'Obtener productos por artesano'
        #swagger.description = 'Obtiene la cantidad de productos registrados por cada artesano, junto con sus datos de contacto.'

        #swagger.responses[200] = {
            description: 'Reporte de productos por artesano obtenido correctamente',
            schema: { $ref: '#/components/schemas/ProductosPorArtesano' }
        }

        #swagger.responses[401] = {
            description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
        }

        #swagger.responses[403] = {
           description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
  */
  ...controlesAdministrador, obtenerProductoArtesano);


// Rutas de reportes stands
router.get('/stands', 
  /*
        #swagger.tags = ['Reportes']
        #swagger.summary = 'Obtener reporte de stands'
        #swagger.description = 'Obtiene la cantidad total de stands, la cantidad de stands ocupados y la cantidad de stands disponibles.'

        #swagger.responses[200] = {
            description: 'Reporte de stands obtenido correctamente',
            schema: { $ref: '#/components/schemas/ReporteStands' }
        }

        #swagger.responses[401] = {
            description: "No se proporcionó un token de autenticación válido o la cuenta no existe"
        }

        #swagger.responses[403] = {
           description: "Cuenta inactiva o el usuario no tiene el rol ADMINISTRADOR"
        }
          
        #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
  */
  ...controlesAdministrador, obtenerReporteStands);

export default router;