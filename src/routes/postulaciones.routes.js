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

//rutas de artesano
router.get(
  "/mi-postulacion",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  obtenerMiPostulacion,
);
router.post(
  "/postularme",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  validarMipostulacion,
  crearMiPostulacion,
);

//controles seguridad para rutas de administrador
const controlesAdministrador = [
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
];

//rutas de administrador
router.get(
  "/",
  ...controlesAdministrador,
  validarConsultaPostulacion,
  obtenerPostulaciones,
);
router.post(
  "/",
  ...controlesAdministrador,
  validarPostulacion,
  crearPostulacion,
);
router.put(
  "/:id",
  ...controlesAdministrador,
  validarId,
  validarActualizacionPostulacion,
  actualizarPostulacion,
);
router.get(
  "/:id",
  ...controlesAdministrador,
  validarId,
  obtenerPostulacionPorId,
);

export default router;
