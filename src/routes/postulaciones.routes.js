import express from 'express';
import { validarId } from "../middlewares/validarId.js";
import { obtenerPostulaciones, obtenerPostulacionPorId, crearPostulacion, actualizarPostulacion } from "../controllers/postulaciones.controller.js";
import { validarPostulacion } from "../middlewares/postulaciones.middlewares/validarPostulacion.js";
import { validarActualizacionPostulacion } from "../middlewares/postulaciones.middlewares/validarActualizacionPostulacion.js";
import { validarConsultaPostulacion } from "../middlewares/postulaciones.middlewares/validarConsultaPostulacion.js";

const router = express.Router();

router.get('/', validarConsultaPostulacion, obtenerPostulaciones);
router.get('/:id', validarId, obtenerPostulacionPorId);
router.post('/', validarPostulacion, crearPostulacion);
router.put('/:id', validarId, validarActualizacionPostulacion, actualizarPostulacion);

export default router;