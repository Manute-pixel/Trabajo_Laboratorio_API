import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { artesanoSchema } from "../../validators/artesanos.schemas.js";

export const validarArtesano = (req, res, next) => {
    const resultado = artesanoSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Los datos del artesano son invalidos', 400, detalles));
    }

    req.datosValidados = resultado.data;
    return next();
}