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

//rutas publicas
router.get("/", validarConsultaPostulacion, obtenerPostulaciones);
router.get("/:id", validarId, obtenerPostulacionPorId);
router.post("/", validarPostulacion, crearPostulacion);
router.put(
  "/:id",
  validarId,
  validarActualizacionPostulacion,
  actualizarPostulacion,
);

//rutas protegidas
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

export default router;
