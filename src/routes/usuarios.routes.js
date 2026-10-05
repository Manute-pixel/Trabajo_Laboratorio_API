import express from "express";
import { validarRegistroUsuario } from "../middlewares/validarRegistroUsuario.js";
import {generarUsuario} from "../controllers/usuarios.controller.js";

const router = express.Router();

router.post('/registro', validarRegistroUsuario, generarUsuario );

export default router;