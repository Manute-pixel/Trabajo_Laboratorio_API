import {crearError, detallarErroresZod} from "../utils/errores.js";
import { usuarioSchema} from "../validators/usuarios.schema.js";

export const validarRegistroUsuario = (req, res, next) => {
    const resultado = usuarioSchema.safeParse(req.body);
    
    if(!resultado.success){
        const detalles = detallarErroresZod(resultado.error);
        return next (crearError('Datos de creación inválidos', 400, detalles))
    }

    req.registroValidado = resultado.data;
    return next();
}