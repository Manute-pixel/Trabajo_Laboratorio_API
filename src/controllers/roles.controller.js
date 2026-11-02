import * as rolService from "../services/roles.service.js";

export const agregarRolAdmin = async (req, res, next) => {
  try {
    usuarioId = req.uuidValidado;
    await rolService.asignarAdministrador(usuarioId);
    return res.json({ mensaje: "Rol ADMINISTRADOR asignado" });
  } catch (error) {
    return next(error);
  }
};

export const eliminarRol = async (req, res, next) => {
  try {
    const { id, rol } = req.dto;
    await rolService.retirarRol(id, rol);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
