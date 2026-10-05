import { validarId } from '../middlewares/validarId.js';
import { validarConsultaArtesanos } from '../middlewares/validarConsultaArtesanos.js';
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano, actualizarArtesano, borrarArtesano } from "../controllers/artesanos.controller.js";
import { validarArtesano } from '../middlewares/validarArtesano.js';
import express from 'express';

const router = express.Router();

router.get('/', validarConsultaArtesanos, obtenerArtesanos);

router.get('/:id', validarId, obtenerArtesanoPorId);

router.post('/', validarArtesano, crearArtesano);

router.put('/:id', validarId, validarArtesano, actualizarArtesano);

router.delete('/:id', validarId, borrarArtesano);

export default router;