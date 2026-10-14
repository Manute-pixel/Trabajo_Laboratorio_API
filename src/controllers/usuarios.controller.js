import * as usuarioService from '../services/usuarios.service.js';
import {generarToken} from '../services/tokens.service.js';

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
        const token = generarToken(usuario);
        return res.status(200).json({
            mensaje: "Credenciales verificadas correctamente.",
            token: token,
            usuario: usuario
        });
    } catch (error) {
        return next(error);
    }
}

export const obtenerMiPerfil = async (req, res, next) => {
    try{
        const usuario = await usuarioService.obtenerUsuarioPorId(req.usuario.id);
        if (!usuario) {
            res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
            return res.status(401).json({
                mensaje: "La cuenta asociada al token no existe."
            });
        }
        return res.status(200).json({usuario: usuario});
    }
    catch(error){
        return next(error);
    }
}