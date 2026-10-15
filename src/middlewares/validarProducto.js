import {crearError, detallarErroresZod} from "../utils/errores.js";
import { productoSchema } from "../validators/productos.schemas.js";

export const validarProducto = (req, res, next) => {
    const resultado = productoSchema.safeParse(req.body);
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error);
        return next(crearError("Datos inválidos", 400, detalle));
    }
    
    req.consultaValidada = resultado.data;
    return next();
}