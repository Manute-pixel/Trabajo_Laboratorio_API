import express from "express";
import { validarRegistroUsuario } from "../middlewares/validarRegistroUsuario.js";
import {validarInicioSesion} from "../middlewares/validarInicioSesion.js"
import {generarUsuario, iniciarSesionUsuario} from "../controllers/usuarios.controller.js";

const router = express.Router();

router.post('/registro', validarRegistroUsuario, generarUsuario );
router.post('/login', validarInicioSesion, iniciarSesionUsuario);

export default router;