import {crearError} from "../utils/errores.js";
import {standActualizacionSchema} from "../validators/stand.schema.js";
export const validarActualizacionStand = (req, res, next) => {
    const resultado = standActualizacionSchema.safeParse(req.body);
    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de actualización de stand inválidos', 400, detalles));
    }

    req.standValidado = resultado.data;
    return next();
}