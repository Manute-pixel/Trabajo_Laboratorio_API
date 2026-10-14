import { crearError } from '../utils/errores.js';
import * as artesanosService from '../services/artesanos.service.js';   

export const obtenerArtesanos = async(req, res, next) => {
    try {
        const criterios = req.consultaValidada;
        const artesanos = await artesanosService.consultarArtesanos(criterios);
        res.status(200).json(artesanos);
    } catch (error) {
        next(error);
    }
};

export const obtenerArtesanoPorId = async (req, res, next) => {
    try {
        const id = req.id;
        const artesano = await artesanosService.consultarArtesanoPorId(id);

        res.status(200).json(artesano);
    } catch (error) {
        next(error);
    }
};


export const crearArtesano = async (req, res, next) => {
    try {
        const datos = req.datosValidados;

        const nuevoArtesano = await artesanosService.crearArtesano(datos);
        res.status(201).json({ mensaje: "Artesano creado exitosamente", artesano: nuevoArtesano });
    } catch (error) {
        next(error);
    }
};

export const actualizarArtesano = async (req, res, next) => {
    try {
        const id = req.id;
        const datos = req.body;

        const artesanoActualizado = await artesanosService.actualizarArtesano(id, datos);

        res.status(200).json({mensaje: "actualizacion exitosa", artesano: artesanoActualizado});
    } catch (error) {
        next(error);
    }
};

export const borrarArtesano = async (req, res, next) => {
    try {
        const id = req.id;
        await artesanosService.eliminarArtesano(id);

        res.status(204).send(`Artesano con id ${id} eliminado correctamente`);
    } catch (error) {
        next(error);
    }
};