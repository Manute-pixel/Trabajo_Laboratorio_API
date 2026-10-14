import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarArtesano = async (artesanoId) => {
  if (artesanoId == undefined || artesanoId == null) {
    return;
  }

  const existe = await prisma.artesano.findUnique({where: {id: artesanoId}});

  if (!existe) {
    throw crearError(`no existe un artesano con id ${artesanoId}`, 400);
  }
};

const verificarEdicion = async (edicionId) => {
  if (edicionId == undefined || edicionId == null) {
    return;
  }

  const existe = await prisma.edicion.findUnique({where: {id: edicionId}});

  if (!existe) {
    throw crearError(`no existe una edicion con id ${edicionId}`, 400);
  }
};

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
      include: {  artesano: true, edicion: true }
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
        include: { artesano: true, edicion: true }
    });
}

export const crearPostulacion = async (datos) => {
  const { artesanoId, edicionId } = datos;

  const existe = await prisma.postulacion.findFirst({
    where: {
      artesanoId: artesanoId,
      edicionId: edicionId,
    }
  });

  if (existe) {
    return null;
  }

  await verificarArtesano(artesanoId);
  await verificarEdicion(edicionId);

  return await prisma.postulacion.create({
    data: {
      artesanoId: artesanoId,
      edicionId: edicionId,
    },
    include: { artesano: true, edicion: true }
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
  
  await verificarArtesano(artesanoId);
  await verificarEdicion(edicionId);

  return await prisma.postulacion.update({
    where: { id },
    data: {
      artesanoId: artesanoId,
      edicionId: edicionId,
      estado_postulacion: estado,
    },
    include : { artesano: true, edicion: true }
  });
};
