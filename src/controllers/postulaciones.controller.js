import { crearError } from "../utils/errores.js";
import * as postulacionesService from "../services/postulaciones.service.js";

export const obtenerPostulaciones = async (req, res, next) => {
  try {
    const criterios = req.consultaValidada;
    const postulaciones =
      await postulacionesService.obtenerPostulaciones(criterios);
    res.status(200).json(postulaciones);
  } catch (error) {
    next(error);
  }
};

export const obtenerPostulacionPorId = async (req, res, next) => {
  try {
    const id = req.id;
    const postulacion = await postulacionesService.obtenerPostulacionPorId(id);
    if (!postulacion) {
      return next(crearError(`Postulacion con id ${id} no encontrada`, 404));
    }
    res.status(200).json(postulacion);
  } catch (error) {
    next(error);
  }
};

export const crearPostulacion = async (req, res, next) => {
  try {
    const datos = req.postulacionValidada;
    const nuevaPostulacion = await postulacionesService.crearPostulacion(datos);

    res.status(201).json({
      mensaje: "Postulacion creada exitosamente",
      postulacion: nuevaPostulacion,
    });
  } catch (error) {
    next(error);
  }
};

export const actualizarPostulacionAdmin = async (req, res, next) => {
  try {
    const id = req.id;
    const { estado } = req.actualizacionValidada;

    const postulacionActualizada =
      await postulacionesService.actualizarPostulacion(id, estado);

    res.status(200).json({
      mensaje: "Postulacion actualizada exitosamente",
      postulacion: postulacionActualizada,
    });
  } catch (error) {
    next(error);
  }
};

// controladores de rutas protegidas
export const crearMiPostulacion = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id;
    const { edicionId } = req.MipostulacionValidada;

    const nuevaPostulacion = await postulacionesService.crearMiPostulacion(
      usuarioId,
      edicionId,
    );

    res.status(201).json({
      mensaje: "Postulacion creada exitosamente",
      postulacion: nuevaPostulacion,
    });
  } catch (error) {
    next(error);
  }
};

export const obtenerMiPostulacion = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id;
    const postulacion =
      await postulacionesService.obtenerMiPostulacion(usuarioId);

    res.status(200).json(postulacion);
  } catch (error) {
    next(error);
  }
};

export const actualizarMiPostulacion = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id;
    const datos = req.actualizacionValidada;

    const postulacionActualizada =
      await postulacionesService.actualizarMiPostulacion(usuarioId, datos);

    res.status(200).json({
      mensaje: "Postulacion actualizada exitosamente",
      postulacion: postulacionActualizada,
    });
  } catch (error) {
    next(error);
  }
};
