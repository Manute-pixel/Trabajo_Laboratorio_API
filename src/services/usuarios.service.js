import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const FACTOR_COSTO = 10;

export const registrarUsuarioArtesano = async (registrarUsuarioDTO) => {
  const {
    nombre,
    apellido,
    email,
    password,
    dni,
    telefono,
    fechaNac,
    rubroId,
    localidadId,
    provinciaId,
  } = registrarUsuarioDTO;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email_usuario: email },
  });

  if (usuarioExistente) {
    throw crearError("Ya existe un usuario con ese email", 409);
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

  return prisma.usuario.create({
    data: {
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      email_usuario: email,
      password: passwordHash,
      activo: true,
      roles: { create: { rol: { connect: { nombre_rol: "ARTESANO" } } } },
      artesano: {
        create: {
          nombre_artesano: nombre,
          apellido_artesano: apellido,
          dni: dni,
          email_artesano: email,
          telefono_artesano: telefono,
          fecha_Nacimiento: fechaNac,
          rubroId: rubroId,
          localidadId: localidadId,
          provinciaId: provinciaId,
        },
      },
    },
    select: {
      id: true,
      nombre_usuario: true,
      apellido_usuario: true,
      email_usuario: true,
      activo: true,
      createdAt: true,
      artesano : {select: {id: true}},
    },
  });
};

export const registrarAdministrador = async (dto) => {
  const { nombre, apellido, email, password } = dto;
  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

  return prisma.usuario.create({
    data: {
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      email_usuario: email,
      password: passwordHash,
      activo: true,
      roles: {
        create: {
          rol: { connect: { nombre: "ADMINISTRADOR" } },
        },
      },
    },
    select: {
      id: true,
      nombre_usuario: true,
      apellido_usuario: true,
      email_usuario: true,
      activo: true,
    },
  });
};

export const iniciarSesion = async (iniciarSesionDto) => {
  const { email, password } = iniciarSesionDto;

  const usuario = await prisma.usuario.findUnique({
    where: { email_usuario: email },
  });

  if (!usuario) {
    throw crearError("Las credenciales son inválidas", 401);
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida || !usuario.activo) {
    throw crearError("Las credenciales son inválidas", 401);
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre_usuario,
    email: usuario.email_usuario,
  };
};

export const obtenerUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: {id},
    select: {
      id: true, nombre_usuario: true, apellido_usuario: true, email_usuario: true, activo: true,
      roles: {
        select: { rol: {select: {nombre_usuario: true}}}
      },
      artesano: {select: {id: true}}
    }
  });
  if (!usuario) return null;
  return {
    ...usuario, 
    roles: usuario.roles.map(asignacion => asignacion.rol.nombre_usuario)
  };
};
