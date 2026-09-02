import express from 'express';
import { validarId } from '../middlewares/validarId.js';
import { obtenerStands, obtenerStandPorId} from "../controllers/stands.controller.js";

const router = express.Router();

router.get('/', obtenerStands);
router.get('/:id', validarId, obtenerStandPorId);


export default router;