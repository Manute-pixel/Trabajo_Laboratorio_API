import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const FACTOR_COSTO = 10;

export const registrarUsuario = async (registrarUsuarioDTO) => {
    const {nombre, apellido, email, password, rol_usuario} = registrarUsuarioDTO;

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {email: email}
    });

    if(usuarioExistente){
        return next(crearError("Ya existe un usuario con ese email", 409))
    }

    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

    return prisma.usuario.create ({
        data:{
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            email_usuario: email,
            password: passwordHash,
            rol_usuario: rol_usuario
        },
        select:{
            id: true,
            nombre_usuario: true,
            apellido_usuario: true,
            email_usuario: true,
            createdAt: true
        }
    });
}