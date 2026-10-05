import { crearError, detallarErroresZod } from "../utils/errores.js";
import { consultarArtesanoSchema } from "../validators/artesanos.schemas.js";

export const validarConsultaArtesanos = (req, res, next) => {
    const resultado = consultarArtesanoSchema.safeParse(req.query);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Los parametros de consulta son invalidos', 400, detalles));
    }

    req.consultaValidada = resultado.data;
    return next();
}