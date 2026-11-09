import prisma from "../config/prisma.js";

export const crearConsulta = async (tipoConsulta, busqueda) => {
  const consulta = await prisma.consulta.create({
    data: {
      tipo_consulta: tipoConsulta,
      busqueda_realizada: JSON.stringify(busqueda),
    },
  });

  if (!consulta) return null;
  return consulta.busqueda_realizada;
};
