import {crearError, detallarErroresZod} from "../utils/errores.js";
import { productoSchema } from "../validators/productos.schemas.js";

export const validarProducto = (req, res, next) => {
    const resultado = productoSchema.safeParse(req.body);
    if (!resultado.success) {
        const errores = detallarErroresZod(resultado.error);
        return res.status(400).json(crearError("Datos inválidos", errores));
    }
    next();
}