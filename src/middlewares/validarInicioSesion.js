import { crearError, detallarErroresZod } from "../utils/errores.js";
import {inicioSesionSchema} from "../validators/usuarios.schema.js";

export const validarInicioSesion = (req, res, next) => {
    const resultado = inicioSesionSchema.safeParse(req.body);
        if (!resultado.success) {
            const detalle = detallarErroresZod(resultado.error);
            return next(crearError("Datos inválidos", 400, detalle));
        }
        
        req.inicioSesionValidado = resultado.data;
        return next();
}