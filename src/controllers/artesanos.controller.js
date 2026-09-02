import { artesanos } from '../data/artesanos.js';
import { crearError } from '../utils/errores.js';

export const obtenerArtesanos = (req, res) => {
    res.status(200).json(artesanos);
};

export const obtenerArtesanoPorId = (req, res, next) => {
    const id = req.id;
    const artesano = artesanos.find(artesano => artesano.id === id);
    if (!artesano) {
        return next(crearError("artesano no encontrado", 404));
    }
    res.status(200).json(artesano);
};

export const crearArtesano = (req, res, next) => {
    const {nombre, dni, rubro, localidad } = req.body;
    
    const nuevoArtesano = {
        id: artesanos.length > 0 ? Math.max(...artesanos.map(a => a.id)) + 1 : 1,
        nombre,
        dni,
        rubro,
        localidad,
    };
    if (artesanos.some(artesano => artesano.nombre === nombre && artesano.dni === dni)) {
        return next(crearError("El artesano ya existe", 400));
    }
    

    if (!nombre || !dni || !rubro || !localidad) {
        return next(crearError("Todos los campos de un artesano son obligatorios", 400));
    }
    artesanos.push(nuevoArtesano);
    res.status(201).json({
        mensaje: 'Artesano agregado exitosamente',
        artesano: nuevoArtesano
    });
    
};

export const actualizarArtesano = (req, res, next) => {
    const id = req.id;
    const { nombre, dni, rubro, localidad } = req.body;
    const artesanoIndex = artesanos.findIndex(artesano => artesano.id === id);

    if (artesanoIndex === -1) {
        return next(crearError("artesano no encontrado", 404));
    }

    if (!nombre || !dni || !rubro || !localidad) {
        return next(crearError("Todos los campos de un artesano son obligatorios", 400));
    }

    artesanos[artesanoIndex] = { ...artesanos[artesanoIndex], nombre, dni, rubro, localidad };

    res.status(200).json({
        mensaje: 'Artesano actualizado exitosamente',
        artesano: artesanos[artesanoIndex]
    });
};

export const borrarArtesano = (req, res, next) => {
    const id = req.id;
    const artesanoIndex = artesanos.findIndex(artesano => artesano.id === id);

    if (artesanoIndex === -1) {
        return next(crearError("artesano no encontrado", 404));
    }

    artesanos.splice(artesanoIndex, 1);

    res.status(200).json({
        mensaje: 'Artesano eliminado exitosamente'
    });
};