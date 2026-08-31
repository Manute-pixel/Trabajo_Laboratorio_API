import { validarId } from '../middlewares/validarId.js';
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano, actualizarArtesano, borrarArtesano } from "../controllers/artesanos.controller.js";
import express from 'express';

const router = express.Router();

router.get('/', obtenerArtesanos);

router.get('/:id', validarId, obtenerArtesanoPorId);

router.post('/', crearArtesano);

router.put('/:id', validarId, actualizarArtesano);

router.delete('/:id', validarId, borrarArtesano);

export default router;