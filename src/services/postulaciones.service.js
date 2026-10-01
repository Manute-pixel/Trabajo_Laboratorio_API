import prisma from "../config/prisma.js";

export const obtenerPostulaciones = async (criterios) => {
  const { artesanoId, edicionId, estado, pagina, limite, ordenPor, direccion } =
    criterios;
  const campoOrden = {
    artesanoId: "artesanoId",
    edicionId: "edicionId",
    estado: "estado_postulacion",
  };

  const where = {};

  if (artesanoId !== undefined) where.artesanoId = { contains: artesanoId };
  if (edicionId !== undefined) where.edicionId = { contains: edicionId };
  if (estado !== undefined)
    where.estado_postulacion = { contains: estado, mode: "insensitive" };

  const desplazamiento = (pagina - 1) * limite;

  const [postulaciones, total] = await prisma.$transaction([
    prisma.postulacion.findMany({
      where,
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
    }),
    prisma.postulacion.count({ where }),
  ]);

  return {
    postulaciones,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerPostulacionPorId = async (id) => {
    return prisma.postulacion.findUnique({
        where: { id },
    });
}

export const crearPostulacion = async (datos) => {
  const { artesanoId, edicionId } = datos;

  const existe = await prisma.postulacion.findFirst({
    where: {
      artesanoId: artesanoId,
      edicionId: edicionId,
    },
  });

  if (existe) {
    return null;
  }

  return await prisma.postulacion.create({
    data: {
      artesanoId: artesanoId,
      edicionId: edicionId,
    },
  });
};

export const actualizarPostulacion = async (id, datos) => {
  const existe = await prisma.postulacion.findUnique({
    where: { id },
  });

  if (!existe) {
    return null;
  }

  const { artesanoId, edicionId, estado } = datos;

  return await prisma.postulacion.update({
    where: { id },
    data: {
      artesanoId: artesanoId,
      edicionId: edicionId,
      estado_postulacion: estado,
    },
  });
};
