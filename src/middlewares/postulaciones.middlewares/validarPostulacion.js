import { crearError, detallarErroresZod } from "../../utils/errores.js";
import {
  postulacionSchema,
  MipostulacionSchema,
} from "../../validators/postulaciones.schemas.js";

export const validarPostulacion = (req, res, next) => {
  const resultado = postulacionSchema.safeParse(req.body);

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Datos para crear postulación inválidos", 400, detalles),
    );
  }

  req.postulacionValidada = resultado.data;
  next();
};

export const validarMipostulacion = (req, res, next) => {
  const resultado = MipostulacionSchema.safeParse(req.body);

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Datos para crear mi postulación inválidos", 400, detalles),
    );
  }

  req.MipostulacionValidada = resultado.data;
  next();
};
