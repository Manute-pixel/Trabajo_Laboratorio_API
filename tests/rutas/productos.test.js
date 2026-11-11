import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

const casosPublicos = [
  {
    nombre: "Listar productos sin filtros",
    ruta: "/productos",
    estado: 200,
  },
  {
    nombre: "Consultar producto con ID no numérico",
    ruta: "/productos/abc",
    estado: 400,
  },
];

for (const caso of casosPublicos) {
  test(`GET ${caso.ruta} - ${caso.nombre}`, async () => {
    const respuesta = await peticion("get", caso.ruta);
    assert.equal(respuesta.status, caso.estado);
  });
}

const casosProtegidos = [
  { metodo: "post", ruta: "/productos", nombre: "Crear producto" },
  { metodo: "put", ruta: "/productos/1", nombre: "Actualizar producto" },
  { metodo: "delete", ruta: "/productos/1", nombre: "Eliminar producto" },
  {
    metodo: "get",
    ruta: "/productos/mis-productos",
    nombre: "Listar mis productos",
  },
  {
    metodo: "get",
    ruta: "/productos/mis-productos/1",
    nombre: "Consultar uno de mis productos",
  },
  {
    metodo: "post",
    ruta: "/productos/crear-mi-producto",
    nombre: "Crear mi producto",
  },
  {
    metodo: "put",
    ruta: "/productos/actualizar-mi-producto/1",
    nombre: "Actualizar mi producto",
  },
  {
    metodo: "delete",
    ruta: "/productos/eliminar-mi-producto/1",
    nombre: "Eliminar mi producto",
  },
];

for (const caso of casosProtegidos) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - ${caso.nombre} sin token`, async () => {
    const respuesta = await peticion(caso.metodo, caso.ruta);
    assert.equal(respuesta.status, 401);
  });
}

test("GET /productos/mis-productos - token válido de artesano", async () => {
  const { artesano } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/productos/mis-productos")
    .set("Authorization", `Bearer ${artesano}`);

  assert.equal(respuesta.status, 200);
});
