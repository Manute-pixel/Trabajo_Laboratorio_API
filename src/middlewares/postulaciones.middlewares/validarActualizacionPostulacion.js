import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { actualizarPostulacionSchemaAdmin } from "../../validators/postulaciones.schemas.js";
import { actualizarPostulacionSchemaArtesano } from "../../validators/postulaciones.schemas.js";

export const validarActualizacionPostulacionAdmin = (req, res, next) => {
    const resultado = actualizarPostulacionSchemaAdmin.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos para actualizar postulación inválidos', 400, detalles));
    }

    req.actualizacionValidada = resultado.data;
    next();
}

export const validarActualizacionPostulacionArtesano = (req, res, next) => {
    const resultado = actualizarPostulacionSchemaArtesano.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos para actualizar mi postulación inválidos', 400, detalles));
    }

    req.actualizacionValidada = resultado.data;
    next();
}

