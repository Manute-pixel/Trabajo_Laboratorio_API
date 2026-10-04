import { consultarPostulacionSchema } from "../../validators/postulaciones.schemas.js";
import { crearError, detallarErroresZod } from "../../utils/errores.js";

export const validarConsultaPostulacion = (req, res, next) => {
    const resultado = consultarPostulacionSchema.safeParse(req.query);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de libro inválidos', 400, detalles));
    }

    req.consultaValidada = resultado.data;
    return next();
};