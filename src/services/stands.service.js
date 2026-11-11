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
    fecha,
    fechaDesde,
    fechaHasta,
    sector,
    pabellon,
    edicion,
    artesano,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;
  const where = {};
  if (numero !== undefined) where.numero_stand = { equals: numero };
  if (estado !== undefined)
    where.estado_stand = { contains: estado, mode: "insensitive" };
  // filtra por fecha y pone en prioridad la fecha exacta sobre el rango de fechas
  if (fecha !== undefined) {
    where.createdAt = { equals: fecha };
  } else if (fechaDesde !== undefined || fechaHasta !== undefined) {
    where.createdAt = {};

    if (fechaDesde !== undefined) where.createdAt.gte = fechaDesde;
    if (fechaHasta !== undefined) where.createdAt.lte = fechaHasta;
  }
  //filtra por relaciones para obtener ubicacion del stand
  if (sector !== undefined || pabellon !== undefined || edicion !== undefined) {
    where.sector = {};

    if (sector !== undefined) {
      where.sector.nombre_sector = { contains: sector, mode: "insensitive" };
    }

    if (pabellon !== undefined || edicion !== undefined) {
      where.sector.pabellon = {};

      if (pabellon !== undefined) {
        where.sector.pabellon.nombre_pabellon = {
          contains: pabellon,
          mode: "insensitive",
        };
      }

      if (edicion !== undefined) {
        where.sector.pabellon.edicion = {
          nombre_edicion: {
            contains: edicion,
            mode: "insensitive",
          },
        };
      }
    }
  }

  if (artesano !== undefined)
    where.artesano = {
      nombre_artesano: { contains: artesano, mode: "insensitive" },
    };

  const desplazamiento = (pagina - 1) * limite;
  const campoOrden = {
    numero: "numero_stand",
    estado: "estado_stand",
    sector: "sector",
    pabellon: "pabellon",
    edicion: "edicion",
    artesano: "artesano",
    fecha: "createdAt",
  };
  const orden = campoOrden[ordenPor];

  let orderBy;

  switch (orden) {
    case "sector":
      orderBy = { sector: { nombre_sector: direccion } };
      break;

    case "pabellon":
      orderBy = {
        sector: {
          pabellon: { nombre_pabellon: direccion },
        },
      };
      break;

    case "edicion":
      orderBy = {
        sector: {
          pabellon: {
            edicion: { nombre_edicion: direccion },
          },
        },
      };
      break;

    case "artesano":
      orderBy = { artesano: { nombre_artesano: direccion } };
      break;

    default:
      orderBy = { [orden]: direccion };
  }

  const [stands, total] = await prisma.$transaction([
    prisma.stand.findMany({
      where,
      orderBy: [orderBy, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      select: {
        id: true,
        numero_stand: true,
        estado_stand: true,
        createdAt: true,
        artesano: {
          select: {
            id: true,
            nombre_artesano: true,
            apellido_artesano: true,
            telefono_artesano: true,
          },
        },
        sector: {
          select: {
            id: true,
            nombre_sector: true,
            pabellon: {
              select: {
                id: true,
                nombre_pabellon: true,
                edicion: {
                  select: {
                    id: true,
                    nombre_edicion: true,
                  },
                },
              },
            },
          },
        },
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
    select: {
      id: true,
      numero_stand: true,
      estado_stand: true,
      createdAt: true,
      artesano: {
        select: {
          id: true,
          nombre_artesano: true,
          apellido_artesano: true,
          telefono_artesano: true,
        },
      },
      sector: {
        select: {
          id: true,
          nombre_sector: true,
          pabellon: {
            select: {
              id: true,
              nombre_pabellon: true,
              edicion: {
                select: {
                  id: true,
                  nombre_edicion: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const crearStand = async (standData) => {
  const { numero, sectorId } = standData;
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
    data: { numero_stand: numero, estado_stand: "DISPONIBLE", sectorId },
    select: {
      id: true,
      numero_stand: true,
      estado_stand: true,
      createdAt: true,
      artesano: true,
      sector: {
        select: {
          id: true,
          nombre_sector: true,
          pabellon: {
            select: {
              id: true,
              nombre_pabellon: true,
              edicion: {
                select: {
                  id: true,
                  nombre_edicion: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const actualizarStand = async (id, standData) => {
  const standExistente = await prisma.stand.findUnique({ where: { id } });
  if (!standExistente) {
    return null;
  }
  const { numero, sectorId } = standData;
  await verificarSector(sectorId);
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
      estado_stand: "DISPONIBLE",
      sectorId,
    },
    select: {
      id: true,
      numero_stand: true,
      estado_stand: true,
      createdAt: true,
      artesano: true,
      sector: {
        select: {
          id: true,
          nombre_sector: true,
          pabellon: {
            select: {
              id: true,
              nombre_pabellon: true,
              edicion: {
                select: {
                  id: true,
                  nombre_edicion: true,
                },
              },
            },
          },
        },
      },
    },
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
    select: {
      id: true,
      estado_stand: true,
      artesanoId: true,
      sector: {
        select: {
          pabellon: {
            select: {
              edicionId: true,
            },
          },
        },
      },
    },
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
  include: {
    stands: {
      where: {
        sector: {
          pabellon: {
            edicionId: standExistente.sector.pabellon.edicionId,
          },
        },
      },
    },
  },
});

if (!artesanoExistente) {
  throw crearError(`Artesano con id ${artesanoId} no encontrado`, 404);
}

if (artesanoExistente.stands.length > 0) {
  throw crearError(
    `El artesano con id ${artesanoId} ya tiene un stand asignado en esta edición`,
    400,
  );
}

  const postulacion = await prisma.postulacion.findFirst({
    where: {
      artesanoId,
      edicionId: standExistente.sector.pabellon.edicionId,
      estado_postulacion: "ACEPTADO",
    },
  });

  if (!postulacion) {
    throw crearError(
      `El artesano con id ${artesanoId} no tiene una postulación aceptada en esta edición`,
      400,
    );
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
    select: {
      id: true,
      numero_stand: true,
      estado_stand: true,
      createdAt: true,
      artesano: {
        select: {
          id: true,
          nombre_artesano: true,
          apellido_artesano: true,
          telefono_artesano: true,
          email_artesano: true,
          dni: true,
          createdAt: true,
        },
      },
      sector: {
        select: {
          id: true,
          nombre_sector: true,
          pabellon: {
            select: {
              id: true,
              nombre_pabellon: true,
              edicion: {
                select: {
                  id: true,
                  nombre_edicion: true,
                },
              },
            },
          },
        },
      },
    },
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
    select: {
      id: true,
      numero_stand: true,
      estado_stand: true,
      createdAt: true,
      artesano: true,
      sector: {
        select: {
          id: true,
          nombre_sector: true,
          pabellon: {
            select: {
              id: true,
              nombre_pabellon: true,
              edicion: {
                select: {
                  id: true,
                  nombre_edicion: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
