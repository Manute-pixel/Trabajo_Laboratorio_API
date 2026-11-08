import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const validarReferenciasProducto = async ({ categoriaId, artesanoId }) => {
  if (categoriaId !== undefined && categoriaId !== null) {
    const categoria = await prisma.categoria_Producto.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria) {
      throw crearError(`Categoría con ID ${categoriaId} no encontrada`, 404);
    }
  }

  if (artesanoId !== undefined && artesanoId !== null) {
    const artesano = await prisma.artesano.findUnique({
      where: { id: artesanoId },
    });

    if (!artesano) {
      throw crearError(`Artesano con ID ${artesanoId} no encontrado`, 404);
    }
  }
};

export const consultarProductos = async (criterios) => {
  const {
    nombre,
    precioMin,
    precioMax,
    categoriaId,
    artesanoId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;

  const where = {};

  if (nombre !== undefined) {
    where.nombre_producto = { contains: nombre, mode: "insensitive" };
  }

  if (precioMin !== undefined) {
    where.precio_producto = { gte: precioMin };
  }

  if (precioMax !== undefined) {
    where.precio_producto = { ...where.precio_producto, lte: precioMax };
  }

  if (categoriaId !== undefined) {
    where.categoriaId = categoriaId;
  }

  if (artesanoId !== undefined) {
    where.artesanoId = artesanoId;
  }

  const desplazamiento = (pagina - 1) * limite;

  const campoOrden = {
    nombre: "nombre_producto",
    precio: "precio_producto",
    categoriaId: "categoriaId",
    artesanoId: "artesanoId",
  };

  const [productos, total] = await prisma.$transaction([
    prisma.producto.findMany({
      where,
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: {
        categoria: true,
        artesano: true,
      },
    }),
    prisma.producto.count({ where }),
  ]);

  return {
    productos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const consultarProductoPorId = async (productoId) => {
  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    throw crearError(`Producto con ID ${productoId} no encontrado`, 404);
  }

  return producto;
};

export const agregarProducto = async (nuevoProducto) => {
  const { nombre, descripcion, precio, categoriaId, artesanoId } =
    nuevoProducto;

  await validarReferenciasProducto({ categoriaId, artesanoId });

  const productoCreado = await prisma.producto.create({
    data: {
      nombre_producto: nombre,
      descripcion: descripcion,
      precio_producto: precio,
      categoriaId: categoriaId,
      artesanoId: artesanoId,
    },
  });
  return productoCreado;
};

export const actualizarProducto = async (id, datos) => {
  const productoExistente = await prisma.producto.findUnique({
    where: { id: id },
  });

  if (!productoExistente) {
    throw crearError(`Producto con ID ${id} no encontrado`, 404);
  }

  const { nombre, descripcion, precio, categoriaId, artesanoId } = datos;

  await validarReferenciasProducto({ categoriaId, artesanoId });

  const productoActualizado = await prisma.producto.update({
    where: { id: id },
    data: {
      nombre_producto: nombre,
      descripcion: descripcion,
      precio_producto: precio,
      categoriaId: categoriaId,
      artesanoId: artesanoId,
    },
  });

  return productoActualizado;
};

export const eliminarProducto = async (id) => {
  const productoExistente = await prisma.producto.findUnique({
    where: { id: id },
  });

  if (!productoExistente) {
    throw crearError(`Producto con ID ${id} no encontrado`, 404);
  }

  return prisma.producto.delete({
    where: { id: id },
  });
};

//nuevos servicios de rutas protegidas

export const crearMiProducto = async (usuarioId, datos) => {
  const { nombre, descripcion, precio, categoriaId } = datos;

  return prisma.$transaction(async (tx) => {
    const artesano = await tx.artesano.findUnique({
      where: { usuarioId },
    });
    if (!artesano) throw crearError("El usuario no es un artesano", 403);

    const categoria = await tx.categoria.findUnique({
      where: { id: categoriaId },
    });
    if (!categoria) throw crearError("La categoría solicitada no existe", 404);

    return tx.producto.create({
      data: {
        nombre_producto: nombre,
        descripcion: descripcion,
        precio_producto: precio,
        artesanoId: artesano.id,
        categoriaId: categoriaId,
      },
      select: {
        nombre_producto: true,
        descripcion: true,
        precio_producto: true,
        categoria: true,
        artesano: true,
      },
    });
  });
};

export const listarMisProductos = async (usuarioId, criterios) => {
  const {
    nombre,
    precioMin,
    precioMax,
    categoriaId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criterios;

  const where = {};

  if (nombre !== undefined) {
    where.nombre_producto = { contains: nombre, mode: "insensitive" };
  }

  if (precioMin !== undefined) {
    where.precio_producto = { gte: precioMin };
  }

  if (precioMax !== undefined) {
    where.precio_producto = { ...where.precio_producto, lte: precioMax };
  }

  if (categoriaId !== undefined) {
    where.categoriaId = categoriaId;
  }

  const desplazamiento = (pagina - 1) * limite;

  const campoOrden = {
    nombre: "nombre_producto",
    precio: "precio_producto",
    categoriaId: "categoriaId",
    artesanoId: "artesanoId",
  };

  const [productos, total] = await prisma.$transaction([
    prisma.producto.findMany({
      where: { ...where, artesano: { usuarioId } },
      orderBy: [{ [campoOrden[ordenPor]]: direccion }, { id: "asc" }],
      skip: desplazamiento,
      take: limite,
      include: {
        categoria: true,
        artesano: true,
      },
    }),
    prisma.producto.count({ where: { ...where, artesano: { usuarioId } } }),
  ]);

  return {
    productos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerMiProducto = async (id, usuarioId) => {
  const producto = await prisma.producto.findFirst({
    where: { id, artesano: { usuarioId } },
    select: {
      nombre_producto: true,
      descripcion: true,
      precio_producto: true,
      categoria: true,
      artesano: true,
    },
  });
  if (!producto)
    throw crearError(
      `Producto con ID ${id} no encontrado o no pertenece al artesano`,
      404,
    );
  return producto;
};

export const actualizarMiProducto = async (productoId, usuarioId, datos) => {
  const { nombre, descripcion, precio, categoriaId } = datos;
  const existeProducto = await prisma.producto.findFirst({
    where: { id: productoId, artesano: { usuarioId } },
  });
  if (!existeProducto) {
    throw crearError(
      `Producto con ID ${productoId} no encontrado o no pertenece al artesano`,
      404,
    );
  }

  await validarReferenciasProducto({ categoriaId, artesanoId: existeProducto.artesanoId });

  return prisma.producto.update({
    where: { id: productoId },
    data: {
      nombre_producto: nombre,
      descripcion: descripcion,
      precio_producto: precio,
      categoriaId: categoriaId,
    }
  });
}
