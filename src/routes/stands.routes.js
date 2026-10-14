import express from 'express';
import { validarId } from '../middlewares/validarId.js';
import { obtenerStands, obtenerStandPorId, crearStand, actualizarStand, eliminarStand} from "../controllers/stands.controller.js";
import { validarConsultaStands } from '../middlewares/validarConsultaStands.js';
import { validarCreacionStand } from '../middlewares/validarCreacionStand.js';
import { validarActualizacionStand } from '../middlewares/validarActualizacionStand.js';

const router = express.Router();


router.get('/', validarConsultaStands, obtenerStands);
router.get('/:id', validarId, obtenerStandPorId);
router.post('/', validarCreacionStand, crearStand);
router.put('/:id', validarId, validarActualizacionStand, actualizarStand);
router.delete('/:id', validarId, eliminarStand);

export default router;