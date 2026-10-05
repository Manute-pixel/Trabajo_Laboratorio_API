import { crearError, detallarErroresZod } from "../utils/errores.js";
import {standConsultaSchema} from "../validators/stand.schema.js";

export const validarConsultaStands = (req, res, next) => {
    const resultado = standConsultaSchema.safeParse(req.query);
    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Consulta de stands inválida', 400,detalles));
    }

    req.consultaValidada = resultado.data;
    return next();
}