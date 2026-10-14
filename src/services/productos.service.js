import prisma from '../config/prisma.js';
import {crearError} from '../utils/errores.js';

const validarReferenciasProducto = async ({ categoriaId, artesanoId }) => {
    if (categoriaId !== undefined && categoriaId !== null) {
        const categoria = await prisma.categoria_Producto.findUnique({
            where: { id: categoriaId }
        });

        if (!categoria) {
            throw crearError(`Categoría con ID ${categoriaId} no encontrada`, 404);
        }
    }

    if (artesanoId !== undefined && artesanoId !== null) {
        const artesano = await prisma.artesano.findUnique({
            where: { id: artesanoId }
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
        limite
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

  const [productos, total] = await prisma.$transaction([
    prisma.producto.findMany({
      where,
      orderBy: [{ [ordenPor]: direccion }, { id: "asc" }],
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
    }
  }
}

export const consultarProductoPorId = async(productoId) => {
    const producto = await prisma.producto.findUnique({
        where: ({id: productoId})
    });

    if (!producto) {
        throw crearError(`Producto con ID ${productoId} no encontrado`, 404);
    }

    return producto;
}

export const agregarProducto = async (nuevoProducto) => {
    const {nombre, descripcion, precio, categoriaId, artesanoId} = nuevoProducto;

    await validarReferenciasProducto({ categoriaId, artesanoId });

    const productoCreado = await prisma.producto.create({
        data: {
            nombre_producto: nombre,
            descripcion: descripcion,
            precio: precio,
            categoriaId: categoriaId,
            artesanoId: artesanoId
        }
    });
    return productoCreado;
}

export const actualizarProducto = async (id, datos) => {
    const productoExistente = await prisma.producto.findUnique({
        where: { id: id }
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
           precio: precio,
           categoriaId: categoriaId,
           artesanoId: artesanoId
       }
   });

    return productoActualizado;
}

export const eliminarProducto = async (id) => {
    const productoExistente = await prisma.producto.findUnique({
        where: { id: id }
    });

    if (!productoExistente) {
        throw crearError(`Producto con ID ${id} no encontrado`, 404);
    }

    return prisma.producto.delete({
        where: { id: id }
    });
}