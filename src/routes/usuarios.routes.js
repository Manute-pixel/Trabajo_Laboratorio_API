import express from "express";
import { validarRegistroUsuario } from "../middlewares/validarRegistroUsuario.js";
import { validarInicioSesion } from "../middlewares/validarInicioSesion.js"
import { generarUsuario, iniciarSesionUsuario, obtenerMiPerfil } from "../controllers/usuarios.controller.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";
import { cerrarSesion } from "../controllers/sesiones.controller.js";

const router = express.Router();

router.post('/registro', validarRegistroUsuario, generarUsuario );
router.post('/login', validarInicioSesion, iniciarSesionUsuario);
router.get('/me', autenticarUsuario, obtenerMiPerfil);
router.post('/logout', autenticarUsuario, cerrarSesion);

export default router;