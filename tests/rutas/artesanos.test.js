import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

const casosConsulta = [
  {
    nombre: "Consultar artesanos sin filtros",
    query: {},
    estado: 200,
  },
  {
    nombre: "Consultar con página negativa",
    query: { pagina: -1 },
    estado: 400,
  },
  {
    nombre: "Consultar con página no numérica",
    query: { pagina: "abc" },
    estado: 400,
  },
  {
    nombre: "Consultar con límite cero",
    query: { limite: 0 },
    estado: 400,
  },
  {
    nombre: "Consultar con límite no numérico",
    query: { limite: "abc" },
    estado: 400,
  },
  {
    nombre: "Consultar con límite superior al permitido",
    query: { limite: 100 },
    estado: 400,
  },
  {
    nombre: "Consultar ordenando por nombre",
    query: { ordenPor: "nombre" },
    estado: 200,
  },
  {
    nombre: "Consultar con dirección incorrecta",
    query: { direccion: "medio" },
    estado: 400,
  },
  {
    nombre: "Consultar con dirección ascendente",
    query: { direccion: "asc" },
    estado: 200,
  },
  {
    nombre: "Consultar con dirección descendente",
    query: { direccion: "desc" },
    estado: 200,
  },
  {
    nombre: "Consultar con fecha inválida",
    query: { fechaNac: "fecha-invalida" },
    estado: 400,
  },
  {
    nombre: "Consultar con rubroId negativo",
    query: { rubroId: -5 },
    estado: 400,
  },
  {
    nombre: "Consultar con localidadId negativo",
    query: { localidadId: -5 },
    estado: 400,
  },
  {
    nombre: "Consultar con provinciaId negativo",
    query: { provinciaId: -5 },
    estado: 400,
  },
  {
    nombre: "Consultar con email inválido",
    query: { email: "email-invalido" },
    estado: 400,
  },
  {
    nombre: "Consultar con nombre corto",
    query: { nombre: "ab" },
    estado: 200,
  },
  {
    nombre: "Consultar con apellido corto",
    query: { apellido: "ab" },
    estado: 200,
  },
  {
    nombre: "Consultar con DNI corto",
    query: { dni: "123" },
    estado: 200,
  },
  {
    nombre: "Consultar con rubroId no numérico",
    query: { rubroId: "abc" },
    estado: 400,
  },
];

for (const caso of casosConsulta) {
  test(`GET /artesanos - ${caso.nombre}`, async () => {
    const respuesta = await peticion("get", "/artesanos")
      .query(caso.query);

    assert.equal(respuesta.status, caso.estado);
  });
}

const casosConsultaPorId = [
  {
    nombre: "Consultar artesano con ID negativo",
    id: -1,
    estado: 400,
  },
  {
    nombre: "Consultar artesano con ID no numérico",
    id: "abc",
    estado: 400,
  },
  {
    nombre: "Consultar artesano inexistente",
    id: 1,
    estado: 404,
  },
];

for (const caso of casosConsultaPorId) {
  test(`GET /artesanos/${caso.id} - ${caso.nombre}`, async () => {
    const respuesta = await peticion("get", `/artesanos/${caso.id}`);

    assert.equal(respuesta.status, caso.estado);
  });
}

const casosAutenticacion = [
  {
    nombre: "Consultar perfil sin token",
    ruta: "/artesanos/me",
    token: null,
    estado: 401,
  },
  {
    nombre: "Consultar perfil con formato de autorización incorrecto",
    ruta: "/artesanos/me",
    token: "Bearer",
    estado: 400,
  },
  {
    nombre: "Consultar perfil con token inválido",
    ruta: "/artesanos/me",
    token: "Bearer token-invalido",
    estado: 401,
  },
  {
    nombre: "Actualizar artesano sin token",
    ruta: "/artesanos/1",
    metodo: "patch",
    token: null,
    estado: 401,
  },
  {
    nombre: "Eliminar artesano sin token",
    ruta: "/artesanos/1",
    metodo: "delete",
    token: null,
    estado: 401,
  },
];

for (const caso of casosAutenticacion) {
  test(`${(caso.metodo ?? "get").toUpperCase()} ${caso.ruta} - ${caso.nombre}`, async () => {
    let solicitud = peticion(caso.metodo ?? "get", caso.ruta);

    if (caso.token) {
      solicitud = solicitud.set("Authorization", caso.token);
    }

    const respuesta = await solicitud;
    assert.equal(respuesta.status, caso.estado);
  });
}

test("GET /artesanos/me - token válido de artesano", async () => {
  const { artesano } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/artesanos/me")
    .set("Authorization", `Bearer ${artesano}`);

  assert.equal(respuesta.status, 200);
  assert.ok(respuesta.body.usuario.roles.includes("ARTESANO"));
  assert.ok(respuesta.body.id);
});
