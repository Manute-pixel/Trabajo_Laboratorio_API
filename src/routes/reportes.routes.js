import express from "express";
// middlewares:
import { validarId } from "../middlewares/validarId.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

// controllers:
import {
    obtenerTotalArtesanos,
    obtenerArtesanosLocalidad
} from "../controllers/reportes.controller.js";
const router = express.Router();



router.get('/artesano', autenticarUsuario, cargarContextoUsuario, autorizarRoles("ADMINISTRADOR"), obtenerTotalArtesanos);
router.get('/artesano/localidad', autenticarUsuario, cargarContextoUsuario, autorizarRoles("ADMINISTRADOR"), obtenerArtesanosLocalidad);
export default router;