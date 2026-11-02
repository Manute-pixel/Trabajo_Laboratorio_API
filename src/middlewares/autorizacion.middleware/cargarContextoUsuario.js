import { obtenerUsuarioPorId } from "../../services/usuarios.service.js";
import { crearError } from "../../utils/errores.js";

export const cargarContextoUsuario = async (req, res, next) => {
  const usuario = await obtenerUsuarioPorId(req.usuario.id);
  if (!usuario) {
    res.set("WWW-Authenticate", "Bearer");
    return next(crearError("Cuenta inexistente.", 401));
  }
  if (!usuario.activo) {
    return next(crearError("Cuenta inactiva.", 403));
  }
  req.contextoUsuario = usuario;
  return next();
};
