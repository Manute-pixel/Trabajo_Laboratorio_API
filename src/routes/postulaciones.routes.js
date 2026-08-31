import express from 'express';
import { crearPostulacion } from "../controllers/postulaciones.controller.js";

const router = express.Router();

router.post('/', crearPostulacion);

export default router;