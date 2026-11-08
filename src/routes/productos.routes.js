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
  actualizarMiProducto,
} from "../controllers/productos.controller.js";

const router = express.Router();

const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

//rutas de administrador
router.post("/", ...controlesAdministrador, validarProducto, agregarProducto);
router.put(
  "/:id",
  ...controlesAdministrador,
  validarId,
  validarActualizacionProducto,
  actualizarProducto,
);
router.delete("/:id", ...controlesAdministrador, validarId, eliminarProducto);

//rutas de artesano
router.get(
  "/mis-productos",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarConsultaProductos,
  obtenerMisProductos,
);
router.get(
  "mi-productos/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarId,
  obtenerMiProducto,
);
router.post(
  "/crear-mi-producto",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarProducto,
  crearMiProducto,
);
router.put(
  "/actualizar-mi-producto/:id",
  autenticarUsuario, cargarContextoUsuario, autorizarRoles("ARTESANO"), 
  validarId, validarActualizacionProducto, actualizarMiProducto);

//rutas publicas
router.get("/", validarConsultaProductos, obtenerProductos);
router.get("/:id", validarId, obtenerProductoPorId);

export default router;
