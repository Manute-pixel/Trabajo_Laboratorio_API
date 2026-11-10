import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerTotalArtesanos = async () => {
  const totalArtesanos = await prisma.artesano.count();

  return { totalArtesanos };
};

export const obtenerArtesanosLocalidad = async () => {
  const artesanosPorLocalidad = await prisma.localidad.findMany({
    select: {
      nombre_localidad: true,
      _count: {
        select: {
          artesanos: true
        }
      }
    }
  });

  return artesanosPorLocalidad.map(localidad => ({
    localidad: localidad.nombre_localidad,
    totalArtesanos: localidad._count.artesanos
  }));
};

export const obtenerArtesanosRubro = async () => {
  const artesanosPorRubro = await prisma.rubro.findMany({
    select: {
      nombre_rubro: true,
      _count: {
        select: {
          artesanos: true
        }
      }
    }
  });

  return artesanosPorRubro.map(rubro => ({
    rubro: rubro.nombre_rubro,
    totalArtesanos: rubro._count.artesanos
  }));
};

export const obtenerReporteStands = async () => {
  const standsPorEstado = await prisma.stand.groupBy({
    by: ['estado_stand'],
    _count: {
      id: true
    }
  });

  const totalStands = await prisma.stand.count();

  const estados = Object.fromEntries(
    standsPorEstado.map(stand => [
      stand.estado_stand,
      stand._count.id
    ])
  );

  return {
    totalStands,
    ocupados: estados.OCUPADO || 0,
    disponibles: estados.DISPONIBLE || 0
  };
};
