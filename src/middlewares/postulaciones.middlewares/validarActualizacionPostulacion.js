import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { actualizarPostulacionSchema } from "../../validators/postulaciones.schemas.js";

export const validarActualizacionPostulacion = (req, res, next) => {
    const resultado = actualizarPostulacionSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de postulación inválidos', 400, detalles));
    }

    req.actualizacionValidada = resultado.data;
    next();
}