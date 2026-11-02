import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const asignarAdministrador = async (usuarioId) => {
  return prisma.$transaction(async (tx) => {
    const existe = await tx.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true },
    });
    if (!existe) throw crearError("Usuario no encontrado", 404);
    const rol = await tx.rol.findUnique({
      where: { nombre_rol: "ADMINISTRADOR" },
    });
    if (!rol) throw crearError("Rol no encontrado", 404);
    const clave = { usuarioId, rolId: rol.id };
    return tx.usuarioRol.upsert({
      where: { usuarioId_rolId: clave },
      update: {},
      create: clave,
    });
  });
};

export const retirarRol = async (usuarioId, nombreRol) => {
  return prisma.$transaction(async (tx) => {
    const u = await tx.usuario.findUnique({
      where: { id: usuarioId },
      include: { roles: { include: { rol: true } } },
    });
    if (!u) throw crearError("Usuario no encontrado", 404);
    const asignacion = u.roles.find((a) => a.rol.nombre_rol === nombreRol);
    if (!asignacion) return;
    if (u.roles.length === 1) throw crearError("Debe conservar un rol.", 409);
    if (nombreRol === "ADMINISTRADOR" && u.activo) {
      const otros = await tx.usuario.count({
        where: {
          id: { not: usuarioId },
          activo: true,
          roles: { some: { rol: { nombre_rol: nombreRol } } },
        },
      });
      if (!otros) throw crearError("Debe quedar un administrador activo.", 409);
    }
    if (nombre === "ARTESANO") {
      const artesano = await tx.artesano.findUnique({
        where: { usuarioId },
        select: { id: true },
      });

      const cantidad = await tx.producto.count({
        where: { artesanoId: artesano.id },
      });
      if (cantidad > 0)
        throw crearError(
          "Tiene productos: no se puede retirar el rol ARTESANO.",
          409,
        );
      await tx.artesano.delete({ where: { usuarioId } });
    }
    await tx.usuarioRol.delete({
      where: {
        usuarioId_rolId: { usuarioId, rolId: asignacion.rolId },
      },
    });
  });
};
