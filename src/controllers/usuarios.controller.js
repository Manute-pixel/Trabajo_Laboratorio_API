import * as usuarioService from '../services/usuarios.services.js';

export const generarUsuario = async (req, res, next) => {
    try {
        const registrarUsuarioDTO = req.registrarUsuarioDTO;
        const usuario = await usuarioService.registrarUsuario(registrarUsuarioDTO);

        return res.status(201).json(usuario);
    }catch(error){
        next(error);
    }
}