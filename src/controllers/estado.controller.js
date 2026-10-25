import { cambiarActivo } from "../services/estado.service.js";

export const actualizarActivo = async (req, res) => {
  const usuario = await cambiarActivo(
    req.uuidValidado.id,
    req.dto.activo,
  );
  return res.json(usuario);
};