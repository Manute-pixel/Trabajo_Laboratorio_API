import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const cambiarActivo = async (usuarioId, activo) => {
  return prisma.$transaction(async (tx) => {
    const u = await tx.usuario.findUnique({
      where: { id: usuarioId },
      include: { roles: { include: { rol: true } } },
    });
    if (!u) throw crearError(`Usuario con id ${usuarioId} no encontrado`, 404);

    const esAdmin = u.roles.some((a) => a.rol.nombre_rol === "ADMINISTRADOR");
    if (!activo && u.activo && esAdmin) {
      const otros = await tx.usuario.count({
        where: {
          id: { not: usuarioId },
          activo: true,
          roles: { some: { rol: { nombre_rol: "ADMINISTRADOR" } } },
        },
      });
      if (!otros) throw crearError("Debe quedar un administrador activo.", 409);
    }

    return tx.usuario.update({
      where: { id: usuarioId },
      data: { activo },
      select: { id: true, activo: true },
    });
  });
};
