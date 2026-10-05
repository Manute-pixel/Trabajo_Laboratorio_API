import prisma from "../config/prisma.js";

export const consultarArtesanos = async (criterios) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    fechaNac,
    rubro,
    localidad,
    provincia,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;
  const campoOrden = {
    nombre: "nombre_artesano",
    apellido: "apellido_artesano",
    dni: "DNI",
    email: "email_artesano",
    fechaNac: "fecha_Nacimiento",
    rubro: "rubro",
    localidad: "localidad",
    provincia: "provincia"
  }
  const where = {};

  if (nombre !== undefined) {
    where.nombre_artesano = { contains: nombre, mode: "insensitive" };
  }
  if (apellido !== undefined) {
    where.apellido_artesano = { contains: apellido, mode: "insensitive" };
  }
  if (dni !== undefined) {
    where.dni = { contains: dni, mode: "insensitive" };
  }
  if (email !== undefined) {
    where.email_artesano = { contains: email, mode: "insensitive" };
  }
  if (fechaNac !== undefined) {
    where.fecha_Nacimiento = fechaNac;
  }
  if (rubro !== undefined) {
    where.rubro = { contains: rubro, mode: "insensitive" };
  }
  if (localidad !== undefined) {
    where.localidad = { contains: localidad, mode: "insensitive" };
  }
  if (provincia !== undefined) {
    where.provincia = { contains: provincia, mode: "insensitive" };
  }

  const desplazamiento = (pagina - 1) * limite;

  const [artesanos, total] = await prisma.$transaction([
    prisma.artesano.findMany({
      where,
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
    }),
    prisma.artesano.count({ where }),
  ]);

  return {
    artesanos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const consultarArtesanoPorId = async (artesanoId) => {
    return prisma.artesano.findUnique({
        where: { id: artesanoId },
    });
};

export const crearArtesano = async (datos) => {
    const { nombre, apellido, dni, email, fechaNac, rubro, localidad, provincia } = datos;
    return prisma.artesano.create({
        data: {
            nombre_artesano: nombre,
            apellido_artesano: apellido,
            DNI: dni,
            email_artesano: email,
            fecha_Nacimiento: fechaNac,
            rubro: rubro,
            localidad: localidad,
            provincia: provincia
        },
    });
}

export const actualizarArtesano = async (artesanoId, datos) => {
    const existe = await prisma.artesano.findUnique({
        where: { id: artesanoId },
    });

    if (!existe) {
        return null;
    }

    const { nombre, apellido, dni, email, fechaNac, rubro, localidad, provincia } = datos;

    return prisma.artesano.update({ 
        where: { id: artesanoId },
        data: {
            nombre_artesano: nombre,
            apellido_artesano: apellido,
            DNI: dni,
            email_artesano: email,
            fecha_Nacimiento: fechaNac,
            rubro: rubro,
            localidad: localidad,
            provincia: provincia
        },
    });
}

export const eliminarArtesano = async (artesanoId) => {
    const existe = await prisma.artesano.findUnique({
        where: { id: artesanoId },
    });

    if (!existe) {
        return null;
    }

    return prisma.artesano.delete({
        where: { id: artesanoId },
    });
}
