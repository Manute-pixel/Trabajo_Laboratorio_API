import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerTotalArtesanos = async () => {
  const totalArtesanos = await prisma.artesano.count();

  return { totalArtesanos };
};