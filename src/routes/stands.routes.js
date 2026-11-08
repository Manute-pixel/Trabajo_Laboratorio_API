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

//rutas protegidas de Administrador
router.post("/", ...controlesAdministrador, validarCreacionStand, crearStand);
router.put(
  "/:id",
  ...controlesAdministrador,
  validarId,
  validarActualizacionStand,
  actualizarStand,
);
router.delete("/:id", ...controlesAdministrador, validarId, eliminarStand);
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
router.get("/", validarConsultaStands, obtenerStands);
router.get("/:id", validarId, obtenerStandPorId);

export default router;
