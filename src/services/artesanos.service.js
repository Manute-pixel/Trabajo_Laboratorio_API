import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const consultarArtesanos = async (criterios) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    fechaNac,
    rubroId,
    localidadId,
    provinciaId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;
  const campoOrden = {
    nombre: "nombre_artesano",
    apellido: "apellido_artesano",
    dni: "dni",
    email: "email_artesano",
    fechaNac: "fecha_Nacimiento",
    rubroId: "rubroId",
    localidadId: "localidadId",
    provinciaId: "provinciaId"
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
  if (rubroId !== undefined) {
    where.rubroId = rubroId;
  }
  if (localidadId !== undefined) {
    where.localidadId = localidadId;
  }
  if (provinciaId !== undefined) {
    where.provinciaId = provinciaId;
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
    const artesano = await prisma.artesano.findUnique({
        where: { id: artesanoId },
    });

    if (!artesano) {
      throw crearError(`Artesano con id ${id} no encontrado`, 404);
    }

    return artesano;
};

export const crearArtesano = async (datos) => {
    const { nombre, apellido, dni, email, telefono, fechaNac, rubroId, localidadId, provinciaId } = datos;

		const existeDni = await prisma.artesano.findUnique({
			where: { dni },
		});

		if (existeDni) {
			throw crearError(`Ya existe un artesano con el DNI ${dni}`, 400);
		}

		const existeEmail = await prisma.artesano.findUnique({
				where: { email_artesano: email },
		});

		if (existeEmail) {
			throw crearError(`Ya existe un artesano con el email ${email}`, 400);
		}

    return prisma.artesano.create({
        data: {
            nombre_artesano: nombre,
            apellido_artesano: apellido,
            dni: dni,
            email_artesano: email,
            telefono_artesano: telefono,
            fecha_Nacimiento: fechaNac,
            rubroId: rubroId,
            localidadId: localidadId,
            provinciaId: provinciaId
        },
    });
}

export const actualizarArtesano = async (artesanoId, datos) => {
    const existe = await prisma.artesano.findUnique({
        where: { id: artesanoId },
    });

    if (!existe) {
      throw crearError(`Artesano con id ${artesanoId} no encontrado`, 404);
    }

    const { nombre, apellido, dni, email, telefono, fechaNac, rubroId, localidadId, provinciaId } = datos;

    return prisma.artesano.update({ 
        where: { id: artesanoId },
        data: {
            nombre_artesano: nombre,
            apellido_artesano: apellido,
            dni: dni,
            email_artesano: email,
						telefono_artesano: telefono,
            fecha_Nacimiento: fechaNac,
            rubroId: rubroId,
            localidadId: localidadId,
            provinciaId: provinciaId
        },
    });
}

export const eliminarArtesano = async (artesanoId) => {
    const existe = await prisma.artesano.findUnique({
      where: { id: artesanoId },
    });

    if (!existe) {
      throw crearError(`Artesano con id ${artesanoId} no encontrado`, 404);
    }

    return prisma.artesano.delete({
      where: { id: artesanoId },
    });
}
