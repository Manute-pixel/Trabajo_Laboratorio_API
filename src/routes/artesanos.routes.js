import { validarId } from '../middlewares/validarId.js';
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano } from "../controllers/artesanos.controller.js";
import express from 'express';

const router = express.Router();

router.get('/', obtenerArtesanos);

router.get('/:id', validarId, obtenerArtesanoPorId);

router.post('/', crearArtesano);

export default router;