import { crearError } from "../utils/errores.js";
import {standCreacionSchema} from "../validators/stand.schema.js";
export const validarCreacionStand = (req, res, next) => {
    const resultado = standCreacionSchema.safeParse(req.body);
    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de creación de stand inválidos', 400, detalles));
    }

    req.standValidado = resultado.data;
    return next();
}