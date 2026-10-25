import { registroArtesanoSchema, registrarAdminSchema } from "../../validators/usuarios.schema.js";

export const validarRegistroArtesano = (req, res, next) => {
    const resultado = registroArtesanoSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos para registrar usuario artesano invalidos o incompletos', 400, detalles));
    }

    req.dto = resultado.data;
    return next();
}

export const validarRegistroAdmin = (req, res, next) => {
    const resultado = registrarAdminSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos para registrar usuario admin invalidos o incompletos', 400, detalles));
    }

    req.dto = resultado.data;
    return next();
}