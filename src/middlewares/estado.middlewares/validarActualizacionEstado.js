import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { actualizarActivoSchema } from "../../validators/estado.schema.js";

export const validarActualizacionEstado = (req, res, next) => {
  const resultado = actualizarActivoSchema.safeParse(req.body);

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("parametros invalidos para retirar el rol", 400, detalles),
    );
  }

  req.dto = resultado.data;
  return next();
};
