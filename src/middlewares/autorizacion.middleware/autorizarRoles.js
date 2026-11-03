import { crearError, detallarErroresZod } from "../../utils/errores.js";

export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.contextoUsuario;
    const permitido = (usuario?.roles ?? []).some((rol) =>
      rolesPermitidos.includes(rol),
    );
    if (!permitido)
      return next(
        crearError("No tiene permisos para realizar esta operacion", 403),
      );
    return next();
  };
};
