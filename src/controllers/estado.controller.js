import { cambiarActivo } from "../services/estado.service.js";

export const actualizarActivo = async (req, res, next) => {
  try {
    const usuarioId = req.uuidValidado;
    const datos = req.dto;
    const usuario = await cambiarActivo(usuarioId, datos.activo);
    return res.json(usuario);
  } catch (error) {
    next(error);
  }
};
