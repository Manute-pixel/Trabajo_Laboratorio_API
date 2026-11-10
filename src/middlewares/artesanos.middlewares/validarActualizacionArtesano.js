import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { actualizarArtesanoSchema } from "../../validators/artesanos.schemas.js";

export const validarActualizacionArtesano = (req, res, next) => {
    const resultado = actualizarArtesanoSchema.safeParse(req.body);
    if (!resultado.success) {
        const errores = detallarErroresZod(resultado.error);
        throw crearError("Datos de actualización inválidos", 400, errores);
    }
    req.datosValidados = resultado.data
    next();
};