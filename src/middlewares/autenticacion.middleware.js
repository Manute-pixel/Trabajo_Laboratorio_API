import jwt from "jsonwebtoken";
import { verificarToken } from "../services/tokens.service.js";
import { tokenEstaRevocado } from "../services/revocaciones.js";
import { crearError } from "../utils/errores.js";

export const autenticarUsuario = async (req, res, next) => {
  const encabezado = req.get("Authorization");

  if (!encabezado) {
    res.set("WWW-Authenticate", "Bearer");
    return next(crearError("Se requiere un token de acceso.", 401));
  }

  const coincidencia = /^Bearer +(\S+)$/i.exec(encabezado);

  if (!coincidencia) {
    res.set("WWW-Authenticate", 'Bearer error="invalid_request"');
    return next(crearError("Usar Authorization: Bearer <token>.", 400));
  }

  try {
    req.usuario = verificarToken(coincidencia[1]);
    if (await tokenEstaRevocado(req.usuario.jti)) {
      throw new jwt.JsonWebTokenError("El token ha sido revocado.");
    }
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      return next(error);
    }
    res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
    return next(crearError("El token es inválido, vencido o revocado.", 401));
  }

  return next();
};
