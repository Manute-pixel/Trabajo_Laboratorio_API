import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const verificarSector = async (sectorId) => {
  if (sectorId == undefined || sectorId == null) {
    throw crearError("El stand debe estar asociado a un sector", 400);
  }
  const sector = await prisma.sector.findUnique({ where: { id: sectorId } });
  if (!sector) {
    throw crearError("Sector no encontrado", 404);
  }
};

export const verificarArtesano = async (artesanoId) => {
  if (artesanoId == undefined || artesanoId == null) {
    return;
  }
  const artesano = await prisma.artesano.findUnique({
    where: { id: artesanoId },
  });
  if (!artesano) {
    throw crearError("Artesano no encontrado", 404);
  }
};

export const consultarStands = async (criterios) => {
  const {
    numero,
    estado,
    sectorId,
    artesanoId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;
  const where = {};
  if (numero !== undefined) {
    where.numero = {
      contains: numero,
    };
  }
  if (estado !== undefined) {
    where.estado = {
      contains: estado,
      mode: "insensitive",
    };
  }
  if (sectorId !== undefined) {
    where.sectorId = sectorId;
  }
  if (artesanoId !== undefined) {
    where.artesanoId = artesanoId;
  }
  const desplazamiento = (pagina - 1) * limite;
  const campoOrden = {
    numero: "numero_stand",
    estado: "estado_stand",
    sector: "sectorId",
    artesano: "artesanoId",
  };
  const [stands, total] = await prisma.$transaction([
    prisma.stand.findMany({
      where,
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: {
        sector: true,
        artesano: true,
      },
    }),
    prisma.stand.count({ where }),
  ]);
  return {
    stands,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const consultarStandPorId = async (id) => {
  return prisma.stand.findUnique({
    where: { id: id },
    include: {
      sector: true,
      artesano: true,
    },
  });
};

export const crearStand = async (standData) => {
  const { numero, estado, sectorId } = standData;
  await verificarSector(sectorId);
  const yaExisteStand = await prisma.stand.findUnique({
    where: {
      numero_stand_sectorId: {
        numero_stand: numero,
        sectorId: sectorId,
      },
    },
  });
  if (yaExisteStand) {
    throw crearError(
      `El stand numero ${numero} en el sector con id ${sectorId} ya existe`,
      400,
    );
  }
  return prisma.stand.create({
    data: { numero_stand: numero, estado_stand: estado, sectorId },
    include: { sector: true },
  });
};

export const actualizarStand = async (id, standData) => {
  const standExistente = await prisma.stand.findUnique({ where: { id } });
  if (!standExistente) {
    return null;
  }
  const { numero, estado, sectorId, artesanoId } = standData;
  await verificarSector(sectorId);
  await verificarArtesano(artesanoId);
  const yaExisteStand = await prisma.stand.findUnique({
    where: {
      numero_stand_sectorId: {
        numero_stand: numero,
        sectorId: sectorId,
      },
    },
  });
  if (yaExisteStand && yaExisteStand.id !== id) {
    throw crearError(
      `El stand numero ${numero} en el sector con id ${sectorId} ya existe`,
      400,
    );
  }
  return prisma.stand.update({
    where: { id },
    data: {
      numero_stand: numero,
      estado_stand: estado,
      sectorId,
      artesanoId: artesanoId ?? null,
    },
    include: { sector: true, artesano: true },
  });
};

export const eliminarStand = async (id) => {
  const standExistente = await prisma.stand.findUnique({ where: { id } });
  if (!standExistente) {
    return null;
  }
  return prisma.stand.delete({ where: { id } });
};

export const asociarStand = async (standId, artesanoId) => {
  const standExistente = await prisma.stand.findUnique({
    where: { id: standId },
  });

  if (!standExistente) {
    throw crearError(`Stand con id ${standId} no encontrado`, 404);
  }

  if (standExistente.artesanoId) {
    throw crearError(
      `El stand con id ${standId} ya está asignado a un artesano`,
      400,
    );
  }

  const artesanoExistente = await prisma.artesano.findUnique({
    where: { id: artesanoId },
  });

  if (!artesanoExistente) {
    throw crearError(`Artesano con id ${artesanoId} no encontrado`, 404);
  }

  const yaTieneStand = await prisma.stand.findFirst({
    where: {
      id: standId,
      artesanoId: artesanoId,
    },
  });

  if (yaTieneStand) {
    throw crearError(
      `El artesano con id ${artesanoId} ya tiene asignado ese stand`,
      400,
    );
  }

  return prisma.stand.update({
    where: { id: standId },
    data: {
      artesano: { connect: { id: artesanoId } },
      estado_stand: "OCUPADO",
    },
    include: { sector: true, artesano: true },
  });
};

export const desvincularStand = async (standId) => {
  const standExistente = await prisma.stand.findUnique({
    where: { id: standId },
  });

  if (!standExistente) {
    throw crearError(`Stand con id ${standId} no encontrado`, 404);
  }

  if (!standExistente.artesanoId) {
    throw crearError(
      `El stand con id ${standId} no está asignado a ningún artesano`,
      400,
    );
  }

  return prisma.stand.update({
    where: { id: standId },
    data: {
      artesano: { disconnect: true },
      estado_stand: "DISPONIBLE",
    },
    include: { sector: true, artesano: true },
  });
};
