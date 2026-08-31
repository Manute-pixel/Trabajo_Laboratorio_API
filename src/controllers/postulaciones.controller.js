import {postulaciones} from '../data/postulaciones.js';
import { crearError } from '../utils/error.js';

export const crearPostulacion = (req, res, next) => {
    const { nombre, dni, rubro, localidad } = req.body;
    
    if (!nombre || !dni || !rubro || !localidad) {
        return next(crearError("Todos los campos de una postulacion son obligatorios", 400));
    }
    
    if (postulaciones.some(postulacion => postulacion.nombre === nombre && postulacion.dni === dni)) {
        return next(crearError(`La postulacion para ${nombre} con dni ${dni} ya fue creada`, 400));
    }
    const nuevaPostulacion = {
        id: postulaciones.length > 0 ? Math.max(...postulaciones.map(p => p.id)) + 1 : 1,
        nombre,
        dni,
        rubro,
        localidad,
        fechaPostulacion: new Date().toISOString().split('T')[0],
        estado: "pendiente"
    };

    postulaciones.push(nuevaPostulacion);
    res.status(201).json({
        mensaje: 'Postulacion creada exitosamente',
        postulacion: nuevaPostulacion
    });
}