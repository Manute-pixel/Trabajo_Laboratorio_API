import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { postulacionSchema } from "../../validators/postulaciones.schemas.js";

export const validarPostulacion = (req, res, next) => {
    const resultado = postulacionSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de libro inválidos', 400, detalles));
    }

    req.postulacionValidada = resultado.data;
    next();
}