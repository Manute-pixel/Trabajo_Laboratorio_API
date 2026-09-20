import {crearError} from '../utils/errores.js';
import {productos} from '../data/productos.js';

export const obtenerProductos = (req, res) => {
    res.status(200).json(productos);
};

export const obtenerProductoPorId = (req, res) => {
    const id = req.id;
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        next(crearError("producto no encontrado", 404));
    }

    res.status(200).json(producto);
};