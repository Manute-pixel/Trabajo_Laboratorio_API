import express from "express";
//middlewares
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { validarConsultaProductos } from "../middlewares/validarConsultaProductos.js";
import { validarProducto } from "../middlewares/validarProducto.js";
import { validarActualizacionProducto } from "../middlewares/validarActualizacionProducto.js";
import { validarId } from "../middlewares/validarId.js";

// controllers
import {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerMisProductos,
  obtenerMiProducto,
  crearMiProducto,
} from "../controllers/productos.controller.js";

const router = express.Router();

//rutas publica para obtener productos
router.get("/", 
  /*
    #swagger.tags = ["Productos"]
    #swagger.summary = "Listar y buscar productos"
    #swagger.description = "Permite consultar productos aplicando filtros, ordenamiento y paginación."
    #swagger.security = []

    #swagger.parameters['nombre'] = {
      in: "query",
      description: "Filtrar por nombre",
      type: "string"
    }

    #swagger.parameters['descripcion'] = {
      in: "query",
      description: "Filtrar por descripción",
      type: "string"
    }

    #swagger.parameters['precioMin'] = {
      in: "query",
      description: "Filtrar por precio mínimo",
      type: "number"
    }

    #swagger.parameters['precioMax'] = {
      in: "query",
      description: "Filtrar por precio máximo",
      type: "number"
    }

    #swagger.parameters['categoriaId'] = {
      in: "query",
      description: "Filtrar por categoría",
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
      enum: ["nombre", "descripcion", "precioMin", "precioMax", "categoriaId", "artesanoId"]
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
  validarConsultaProductos, obtenerProductos);


//rutas protegidas
router.get(
  "/mis-productos",
   /*
    #swagger.tags = ["Productos"]
    #swagger.summary = "Listar mis productos"
    #swagger.description = "Permite al artesano autenticado consultar sus propios productos aplicando filtros, ordenamiento y paginación."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.parameters['nombre'] = {
      in: "query",
      description: "Filtrar por nombre",
      type: "string"
    }

    #swagger.parameters['descripcion'] = {
      in: "query",
      description: "Filtrar por descripción",
      type: "string"
    }

    #swagger.parameters['precioMin'] = {
      in: "query",
      description: "Filtrar por precio mínimo",
      type: "number"
    }

    #swagger.parameters['precioMax'] = {
      in: "query",
      description: "Filtrar por precio máximo",
      type: "number"
    }

    #swagger.parameters['categoriaId'] = {
      in: "query",
      description: "Filtrar por categoría",
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
      enum: ["nombre", "descripcion", "precioMin", "precioMax", "categoriaId", "artesanoId"]
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
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarConsultaProductos,
  obtenerMisProductos,
);


router.get(
  "/mi-productos/:id",
  /*
    #swagger.tags = ["Productos"]
    #swagger.summary = "Obtener uno de mis productos"
    #swagger.description = "Obtiene un producto por su ID, siempre que pertenezca al artesano autenticado."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Producto encontrado',
      schema: { $ref: '#/components/schemas/Producto' }
    }

    #swagger.responses[400] = {
      description: 'El ID es inválido'
    }

    #swagger.responses[404] = {
      description: 'No se encontró el producto o no pertenece al artesano autenticado'
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor'
    }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarId,
  obtenerMiProducto,
);
router.post(
  "/crear-mi-producto",
  /*
    #swagger.tags = ["Productos"]
    #swagger.summary = "Crear un producto"
    #swagger.description = "Registra un nuevo producto."
    #swagger.security = [{
       bearerAuth: []
    }]

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/MiProducto"
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "Producto creado exitosamente"
    }

    #swagger.responses[403] = {
      description: "El usuario no tiene el rol ARTESANO"
    }

    #swagger.responses[404] = {
      description: "La categoría solicitada no existe"
    }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarProducto,
  crearMiProducto,
);


router.put(
  "/mi-productos/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO", ),
  validarId,
  actualizarProducto
);
router.delete(
  "/mi-productos/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarId,
  eliminarProducto
);


//ruta publica para obtener un producto por su id
router.get("/:id", 
  /*
    #swagger.tags = ["Productos"]
    #swagger.summary = "Obtener un producto por su ID"
    #swagger.description = "Busca un producto utilizando su identificador."
    #swagger.security = []

    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del producto',
      required: true,
      type: 'integer',
      example: 1
    }

    #swagger.responses[200] = {
      description: 'Producto encontrado',
      schema: { $ref: '#/components/schemas/Producto' }
    }

    #swagger.responses[400] = {
      description: 'El ID es inválido'
    }

    #swagger.responses[404] = {
      description: 'No se encontró el producto'
    }

    #swagger.responses[500] = {
      description: 'Error interno del servidor'
    }
  */
  validarId, obtenerProductoPorId);


/*
router.post("/", validarProducto, agregarProducto);
router.put("/:id", validarId, validarActualizacionProducto, actualizarProducto);
router.delete("/:id", validarId, eliminarProducto);
*/



export default router;
