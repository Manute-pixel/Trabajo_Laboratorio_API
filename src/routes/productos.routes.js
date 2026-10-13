import express from 'express';
import {obtenerProductos, obtenerProductoPorId,
        agregarProducto, actualizarProducto, eliminarProducto
       } from '../controllers/productos.controller.js';
import {validarConsultaProductos} from '../middlewares/validarConsultaProductos.js';
import {validarProducto} from '../middlewares/validarProducto.js';
import { validarActualizacionProducto } from '../middlewares/validarActualizacionProducto.js';
import {validarId} from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', validarConsultaProductos, obtenerProductos);
router.get('/:id', validarId, obtenerProductoPorId);
router.post('/', validarProducto, agregarProducto);
router.put('/:id', validarId, validarActualizacionProducto, actualizarProducto);
router.delete('/:id', validarId, eliminarProducto);

export default router;