import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarArtesano = async (artesanoId) => {
  if (artesanoId == undefined || artesanoId == null) {
    throw crearError(
      "artesanoId es obligatorio para crear una postulacion",
      400,
    );
  }

  const existe = await prisma.artesano.findUnique({
    where: { id: artesanoId },
  });

  if (!existe) {
    throw crearError(`no existe un artesano con id ${artesanoId}`, 404);
  }
};

const verificarEdicion = async (edicionId) => {
  if (edicionId == undefined || edicionId == null) {
    throw crearError(
      "edicionId es obligatorio para crear una postulacion",
      400,
    );
  }

  const existe = await prisma.edicion_Poncho.findUnique({
    where: { id: edicionId },
  });

  if (!existe) {
    throw crearError(`no existe una edicion con id ${edicionId}`, 404);
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

  if (artesanoId !== undefined) where.artesanoId = { equals: artesanoId };
  if (edicionId !== undefined) where.edicionId = { equals: edicionId };
  if (estado !== undefined)
    where.estado_postulacion = { contains: estado, mode: "insensitive" };

  const desplazamiento = (pagina - 1) * limite;

  const [postulaciones, total] = await prisma.$transaction([
    prisma.postulacion.findMany({
      where,
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: { artesano: true, edicion: true },
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
    include: { artesano: true, edicion: true },
  });
};

export const crearPostulacion = async (datos) => {
  const { artesanoId, edicionId } = datos;

  const existe = await prisma.postulacion.findFirst({
    where: {
      artesanoId: artesanoId,
      edicionId: edicionId,
    },
  });

  if (existe)
    throw crearError(
      "ya existe una postulacion para este artesano en esta edicion",
      400,
    );

  await verificarArtesano(artesanoId);
  await verificarEdicion(edicionId);

  return await prisma.postulacion.create({
    data: {
      artesanoId: artesanoId,
      edicionId: edicionId,
      estado_postulacion: "PENDIENTE",
    },
    include: { artesano: true, edicion: true },
  });
};

export const actualizarPostulacion = async (id, estado) => {
  const existe = await prisma.postulacion.findUnique({
    where: { id },
  });

  if (!existe) {
    throw crearError(`Postulacion con id ${id} no encontrada`, 404);
  }
  if (existe.estado_postulacion === estado) {
    throw crearError(
      `El estado de la postulacion ya es ${estado}, no se puede actualizar`,
      400,
    );
  }

  return await prisma.postulacion.update({
    where: { id },
    data: {
      estado_postulacion: estado,
    },
    include: { artesano: true, edicion: true },
  });
};

//servicios de rutas protegidas
export const crearMiPostulacion = async (usuarioId, edicionId) => {
  return prisma.$transaction(async (tx) => {
    const existe = await tx.postulacion.findFirst({
      where: {
        artesano: { usuarioId },
        edicionId: edicionId,
      },
    });

    if (existe) {
      throw crearError(
        "ya existe una postulacion para este artesano en esta edicion",
        400,
      );
    }
    const artesano = await tx.artesano.findUnique({
      where: { usuarioId },
    });
    if (!artesano) throw crearError("usuario no es un artesano", 400);

    await verificarEdicion(edicionId);

    return tx.postulacion.create({
      data: {
        edicionId: edicionId,
        artesanoId: artesano.id,
        estado_postulacion: "PENDIENTE",
      },
      select: {
        id: true,
        fecha_postulacion: true,
        estado_postulacion: true,
        edicion: true,
        artesano: true,
      },
    });
  });
};

export const obtenerMiPostulacion = async (usuarioId) => {
  const postulacion = await prisma.postulacion.findFirst({
    where: { artesano: { usuarioId } },
    select: {
      id: true,
      fecha_postulacion: true,
      estado_postulacion: true,
      edicion: true,
      artesano: true,
    },
  });

  if (!postulacion)
    throw crearError("no tienes una postulacion registrada.", 404);

  return postulacion;
};

export const actualizarMiPostulacion = async (usuarioId, datos) => {
  const { edicionId } = datos;

  const existe = await prisma.postulacion.findFirst({
    where: {
      artesano: {
        usuarioId: usuarioId,
      },
    },
  });

  if (!existe) {
    throw crearError("Postulacion no encontrada", 404);
  }
  if (existe.edicionId === edicionId) {
    throw crearError(
      `La postulacion ya pertenece a la edicion con id ${edicionId}, no se puede actualizar`,
      400,
    );
  }
  await verificarEdicion(edicionId);
  await verificarArtesano(existe.artesanoId);

  return prisma.postulacion.update({
    where: {
      id: existe.id,
    },
    data: {
      edicionId: edicionId,
    },
    select: {
      id: true,
      fecha_postulacion: true,
      estado_postulacion: true,
      edicion: true,
      artesano: true,
    },
  });
};
