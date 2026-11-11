import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

const rutasReportes = [
  "/reportes/artesano",
  "/reportes/artesano-localidad",
  "/reportes/artesano-rubro",
  "/reportes/producto-artesano",
  "/reportes/stands",
];

for (const ruta of rutasReportes) {
  test(`GET ${ruta} - requiere administrador autenticado`, async () => {
    const respuesta = await peticion("get", ruta);
    assert.equal(respuesta.status, 401);
  });
}

test("GET /reportes/artesano - token válido de administrador", async () => {
  const { administrador } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/reportes/artesano")
    .set("Authorization", `Bearer ${administrador}`);

  assert.equal(respuesta.status, 200);
});

test("GET /reportes/artesano - token válido de artesano sin permisos", async () => {
  const { artesano } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/reportes/artesano")
    .set("Authorization", `Bearer ${artesano}`);

  assert.equal(respuesta.status, 403);
});
