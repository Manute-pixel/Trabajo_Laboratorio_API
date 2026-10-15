import {crearError, detallarErroresZod} from "../utils/errores.js";
import { consultarProductoSchema } from "../validators/productos.schemas.js";

const validarConsultaProductos = (req, res, next) => {
    const resultado = consultarProductoSchema.safeParse(req.query);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('Los parametros de consulta son invalidos', 400, detalles));
    }

    req.consultaValidada = resultado.data;
    return next();
}