import { asignarArtesanoSchema } from "../../validators/usuarios.schema.js";

export const validarAsignacionArtesano = (req, res, next) => {
    const resultado = asignarArtesanoSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos para registrar usuario artesano invalidos o incompletos', 400, detalles));
    }

    req.dto = resultado.data;
    return next();
}