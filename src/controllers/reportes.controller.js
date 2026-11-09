import { crearError } from "../utils/errores.js";
import * as reportesService  from "../services/reportes.service.js";

export const obtenerTotalArtesanos = async (req, res, next) => {
  try {
    const reporte = await reportesService.obtenerTotalArtesanos();
    return res.status(200).json(reporte);
  } catch (error) {
    next(error);
  }
};

export const obtenerArtesanosLocalidad = async (req, res, next) => {
    try {
        const reporte = await reportesService.obtenerArtesanosLocalidad();
        return res.status(200).json(reporte);
    } catch (error) {
        next(error);
    }
};