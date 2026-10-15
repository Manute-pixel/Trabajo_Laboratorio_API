import * as usuarioService from '../services/usuarios.services.js';

export const generarUsuario = async (req, res, next) => {
    try {
        const registrarUsuarioDTO = req.registroValidado;
        const usuario = await usuarioService.registrarUsuario(registrarUsuarioDTO);

        return res.status(201).json(usuario);
    }catch(error){
        next(error);
    }
}

export const iniciarSesionUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioService.iniciarSesion(
            req.inicioSesionValidado
        );

        return res.status(200).json({
            mensaje: "Credenciales verificadas correctamente.",
            usuario: usuario
        });
    } catch (error) {
        return next(error);
    }
}