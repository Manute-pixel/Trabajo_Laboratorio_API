import { asignarAdministrador } from "../services/roles.service.js";
import { retirarRol } from "../services/roles.service.js";

export const agregarRolAdmin = async (req, res) =>{
    await asignarAdministrador (req.dto.id);
    return res.json({mensaje: "Rol ADMINISTRADOR asignado"});
}

export const eliminarRol = async (req, res) =>{
    const {id, rol} = req.dto;
    await retirarRol(id, rol);
    return res.status(204).end();
}