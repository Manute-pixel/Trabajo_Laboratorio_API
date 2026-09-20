import {stands} from '../data/stands.js';
import { crearError } from '../utils/errores.js';

export const obtenerStands = (req, res) => {
    res.status(200).json(stands);
};

export const obtenerStandPorId = (req, res, next) => {
    const id = req.id;
    const stand = stands.find(stand => stand.id === id);
    if (!stand) {
        return next(crearError("stand no encontrado", 404));
    }
    res.status(200).json(stand);
};
