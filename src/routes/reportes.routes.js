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
router.get('/artesano', ...controlesAdministrador, obtenerTotalArtesanos);
router.get('/artesano-localidad', ...controlesAdministrador, obtenerArtesanosLocalidad);
router.get('/artesano-rubro', ...controlesAdministrador, obtenerArtesanosRubro);
router.get('/producto-artesano', ...controlesAdministrador, obtenerProductoArtesano);

// Rutas de reportes stands
router.get('/stands', ...controlesAdministrador, obtenerReporteStands);
export default router;