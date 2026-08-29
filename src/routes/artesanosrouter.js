import { validarId } from '../middlewares/validarId.js';
import { obtenerArtesanos } from '../controllers/obtenerArtesanos.js';
import { obtenerArtesanoPorId } from '../controllers/obtenerArtesanoId.js';
import { agregarArtesano } from '../controllers/agregarArtesano.js';
import express from 'express';
const router = express.Router();

router.get('/', obtenerArtesanos);

router.get('/:id', validarId, obtenerArtesanoPorId);

router.post('/', agregarArtesano);

export { router as artesanosRouter };