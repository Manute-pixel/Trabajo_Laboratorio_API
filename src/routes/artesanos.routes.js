import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { validarConsultaArtesanos } from "../middlewares/artesanos.middlewares/validarConsultaArtesanos.js";
import { validarArtesano } from "../middlewares/artesanos.middlewares/validarArtesano.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

// controllers:
import {
  obtenerArtesanos,
  obtenerArtesanoPorId,
  crearArtesano,
  actualizarArtesano,
  borrarArtesano,
  consultarMiArtesano,
} from "../controllers/artesanos.controller.js";
const router = express.Router();

//rutas publicas:
router.get("/", validarConsultaArtesanos, obtenerArtesanos);
router.get("/:id", validarId, obtenerArtesanoPorId);
router.post("/", validarArtesano, crearArtesano);
router.put("/:id", validarId, validarArtesano, actualizarArtesano);
router.delete("/:id", validarId, borrarArtesano);

//rutas protegidas:
router.get(
  "/me",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ARTESANO"),
  consultarMiArtesano,
);

export default router;