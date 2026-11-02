import { crearError, detallarErroresZod } from "../../utils/errores.js";
import { usuarioIdParametrosSchema } from "../../validators/usuarios.schema.js";

export const validarUuid = (req, res, next) => {
  const resultado = usuarioIdParametrosSchema.safeParse(req.params);

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(crearError("id de usuario invalido", 400, detalles));
  }

  req.uuidValidado = resultado.data;
  return next();
};
