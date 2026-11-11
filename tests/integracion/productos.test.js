import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import * as productos from "../../src/services/productos.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

const datosProducto = (nombre = "Producto de integracion") => ({
  nombre,
  descripcion: "Producto utilizado en pruebas de integración",
  precio: 1250.5,
  categoriaId: contexto.categoria.id,
  artesanoId: contexto.artesano.id,
});

const criterios = {
  pagina: 1,
  limite: 10,
  ordenPor: "nombre",
  direccion: "asc",
};

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de productos", () => {
test("Crea, lista y consulta productos con paginación", async () => {
  const creado = await productos.agregarProducto(datosProducto());
  assert.ok(creado.id);

  const lista = await productos.consultarProductos(criterios);
  assert.ok(lista.productos.some(({ id }) => id === creado.id));
  assert.ok(lista.paginacion.total >= 1);

  const encontrado = await productos.consultarProductoPorId(creado.id);
  assert.equal(encontrado.nombre_producto, "Producto de integracion");

  await assert.rejects(
    productos.consultarProductoPorId(2_000_000_000),
    (error) => error.status === 404,
  );
  await productos.eliminarProducto(creado.id);
});

test("Rechaza productos con categoría o artesano inexistentes", async () => {
  await assert.rejects(
    productos.agregarProducto({
      ...datosProducto(),
      categoriaId: 2_000_000_000,
    }),
    (error) => error.status === 404,
  );
  await assert.rejects(
    productos.agregarProducto({
      ...datosProducto(),
      artesanoId: 2_000_000_000,
    }),
    (error) => error.status === 404,
  );
});

test("Actualiza y elimina productos, rechazando ids inexistentes", async () => {
  const producto = await productos.agregarProducto(datosProducto());
  const actualizado = await productos.actualizarProducto(producto.id, {
    ...datosProducto("Producto actualizado"),
  });
  assert.equal(actualizado.nombre_producto, "Producto actualizado");

  await assert.rejects(
    productos.actualizarProducto(2_000_000_000, datosProducto()),
    (error) => error.status === 404,
  );

  const eliminado = await productos.eliminarProducto(producto.id);
  assert.equal(eliminado.id, producto.id);
  await assert.rejects(
    productos.eliminarProducto(producto.id),
    (error) => error.status === 404,
  );
});

test("Permite al artesano crear, listar y obtener sus productos", async () => {
  const creado = await productos.crearMiProducto(
    contexto.usuarioArtesano.id,
    {
      nombre: "Producto propio",
      descripcion: "Creado por el titular",
      precio: 250,
      categoriaId: contexto.categoria.id,
    },
  );
  assert.ok(creado.id);
  assert.equal(creado.artesano.id, contexto.artesano.id);

  const lista = await productos.listarMisProductos(
    contexto.usuarioArtesano.id,
    criterios,
  );
  assert.ok(lista.productos.some(({ id }) => id === creado.id));
  assert.equal(lista.paginacion.total, 1);

  const encontrado = await productos.obtenerMiProducto(
    creado.id,
    contexto.usuarioArtesano.id,
  );
  assert.equal(encontrado.id, creado.id);

  await assert.rejects(
    productos.crearMiProducto(contexto.usuarioAdmin.id, {
      nombre: "No permitido",
      descripcion: "Usuario no artesano",
      precio: 50,
      categoriaId: contexto.categoria.id,
    }),
    (error) => error.status === 403,
  );
  await assert.rejects(
    productos.crearMiProducto(contexto.usuarioArtesano.id, {
      nombre: "Sin categoría",
      descripcion: "Referencia inválida",
      precio: 50,
      categoriaId: 2_000_000_000,
    }),
    (error) => error.status === 404,
  );
});

test("Protege los productos propios al consultar, actualizar y eliminar", async () => {
  const producto = await productos.crearMiProducto(
    contexto.usuarioArtesano.id,
    {
      nombre: "Producto protegido",
      descripcion: "Solo lo administra su titular",
      precio: 150,
      categoriaId: contexto.categoria.id,
    },
  );

  await assert.rejects(
    productos.obtenerMiProducto(producto.id, contexto.usuarioAdmin.id),
    (error) => error.status === 404,
  );
  await assert.rejects(
    productos.actualizarMiProducto(producto.id, contexto.usuarioAdmin.id, {
      nombre: "Modificado",
      descripcion: "No autorizado",
      precio: 200,
      categoriaId: contexto.categoria.id,
    }),
    (error) => error.status === 404,
  );
  await assert.rejects(
    productos.eliminarMiProducto(producto.id, contexto.usuarioAdmin.id),
    (error) => error.status === 404,
  );

  const actualizado = await productos.actualizarMiProducto(
    producto.id,
    contexto.usuarioArtesano.id,
    {
      nombre: "Producto actualizado",
      descripcion: "Actualizado por el titular",
      precio: 300,
      categoriaId: contexto.categoria.id,
    },
  );
  assert.equal(actualizado.nombre_producto, "Producto actualizado");

  const eliminado = await productos.eliminarMiProducto(
    producto.id,
    contexto.usuarioArtesano.id,
  );
  assert.equal(eliminado.id, producto.id);
});
});
