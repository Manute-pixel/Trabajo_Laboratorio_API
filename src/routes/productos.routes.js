import express from 'express';
import {obtenerProductos, obtenerProductoPorId} from '../controllers/productos.controller.js';
import {validarId} from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/:id', validarId, obtenerProductoPorId);

export default router;