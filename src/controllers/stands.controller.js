    
import { crearError } from '../utils/errores.js';
import * as standsService from '../services/stands.service.js'; 
export const obtenerStands = async  (req, res, next) => {
    try {
        const criterios = req.consultaValidada;
        const resultado = await standsService.consultarStands(criterios);
        res.status(200).json(resultado);
    }
    catch (error) {
        next(error);
    }
};

export const obtenerStandPorId = async (req, res, next) => {
    try {
        const id = req.id;
        const stands = await standsService.consultarStandPorId(id);
        if (!stands) {
            return next(crearError("stand no encontrado", 404));
        }
        res.status(200).json(stands);
    }
    catch (error) {
        next(error);
    }
};

export const crearStand = async (req, res, next) => {
    try {
        const body = req.standValidado;
        const nuevoStand = await standsService.crearStand(body);
        res.status(201).json(nuevoStand);
    }
    catch (error) {
        next(error);
    }
};

export const actualizarStand = async (req, res, next) => {
    try {
        const body = req.standValidado;
        const id = req.id;
        const stands = await standsService.actualizarStand(id, body);
        if (!stands) {
            return next(crearError("stand no encontrado", 404));
        }
        res.status(200).json(stands);
    }
    catch (error) {
        next(error);
    }
};

export const eliminarStand = async (req, res, next) => {
    try {
        const id = req.id;
        const standEliminado = await standsService.eliminarStand(id);
        if (!standEliminado) {
            return next(crearError("stand no encontrado", 404));
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
