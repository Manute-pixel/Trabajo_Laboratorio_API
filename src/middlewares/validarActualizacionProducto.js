import {crearError} from "../utils/errores.js";
import {actualizarProductoSchema} from "../validators/productos.schemas.js";

export const validarActualizacionProducto = (req, res, next) => {
    const resultado = actualizarProductoSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Datos de actualización de producto inválidos', 400, detalles));
    }

    req.productoValidado = resultado.data;
    return next();
}