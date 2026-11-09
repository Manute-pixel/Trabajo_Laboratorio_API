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
