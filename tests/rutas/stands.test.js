import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

// Casos para consultar stands
const casosConsulta = [
  {
    nombre: "Consultar stands sin filtros",
    query: {},
    estado: 200,
  },
  {
    nombre: "Consultar con página negativa",
    query: { pagina: -1 },
    estado: 400,
  },
  {
    nombre: "Consultar con límite cero",
    query: { limite: 0 },
    estado: 400,
  },
  {
    nombre: "Consultar con estado inválido",
    query: { estado: "pendiente" },
    estado: 400,
  },
  {
    nombre: "Consultar con orden incorrecto",
    query: { ordenPor: "nombre" },
    estado: 400,
  },
  {
    nombre: "Consultar con dirección incorrecta",
    query: { direccion: "medio" },
    estado: 400,
  },
  {
    nombre: "Consultar con número negativo",
    query: { numero: -5 },
    estado: 400,
  },
  {
    nombre: "Consultar con fecha inválida",
    query: { fecha: "fecha-invalida" },
    estado: 400,
  },
];

for (const caso of casosConsulta) {
  test(`GET /stands - ${caso.nombre}`, async () => {
    const respuesta = await peticion("get", "/stands")
      .query(caso.query);

    assert.equal(respuesta.status, caso.estado);
  });
}

// Casos para rutas protegidas sin token
const casosProtegidos = [
  {
    nombre: "Crear stand sin token",
    metodo: "post",
    ruta: "/stands",
    datos: {
      numero: 10,
      sectorId: 1,
    },
  },
  {
    nombre: "Actualizar stand sin token",
    metodo: "put",
    ruta: "/stands/1",
    datos: {
      numero: 10,
      sectorId: 1,
    },
  },
  {
    nombre: "Eliminar stand sin token",
    metodo: "delete",
    ruta: "/stands/1",
  },
  {
    nombre: "Asignar artesano sin token",
    metodo: "patch",
    ruta: "/stands/asignar-stand-artesano/1",
    datos: {
      artesanoId: 2,
    },
  },
  {
    nombre: "Desvincular artesano sin token",
    metodo: "patch",
    ruta: "/stands/desvincular-stand-artesano/1",
    datos: {
      artesanoId: 2,
    },
  },
];

for (const caso of casosProtegidos) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - ${caso.nombre}`, async () => {
    let solicitud = peticion(caso.metodo, caso.ruta);

    if (caso.datos) {
      solicitud = solicitud.send(caso.datos);
    }

    const respuesta = await solicitud.expect(401);

    assert.equal(respuesta.status, 401);
    assert.match(
      respuesta.headers["content-type"],
      /json/
    );
  });
}

// Casos para consultar stand por ID
const casosPorId = [
  {
    nombre: "ID con letras",
    id: "abc",
    estado: 400,
  },
  {
    nombre: "ID igual a cero",
    id: "0",
    estado: 400,
  },
  {
    nombre: "ID negativo",
    id: "-1",
    estado: 400,
  },
  {
    nombre: "Stand inexistente",
    id: "999999",
    estado: 404,
  },
];

for (const caso of casosPorId) {
  test(`GET /stands/${caso.id} - ${caso.nombre}`, async () => {
    const respuesta = await peticion("get", `/stands/${caso.id}`);

    assert.equal(respuesta.status, caso.estado);
  });
}


const casosAutenticacion = [
  {
    nombre: "Token inválido",
    token: "token-inventado",
    estado: 401,
  },
  {
    nombre: "Formato de autorización incorrecto",
    token: "Bearer",
    estado: 400,
  },
];

for (const caso of casosAutenticacion) {
  test(`POST /stands - ${caso.nombre}`, async () => {
    let solicitud = peticion("post", "/stands")
      .send({
        numero: 10,
        estado: "DISPONIBLE",
        sectorId: 1,
      });

    if (caso.token !== null) {
      solicitud = solicitud.set(
        "Authorization",
        caso.token.startsWith("Bearer")
          ? caso.token
          : `Bearer ${caso.token}`
      );
    }

    const respuesta = await solicitud;

    assert.equal(respuesta.status, caso.estado);
  });
}

test("POST /stands - token válido de administrador", async () => {
  const { administrador } = obtenerTokensPrueba();
  const respuesta = await peticion("post", "/stands")
    .set("Authorization", `Bearer ${administrador}`)
    .send({});

  assert.equal(respuesta.status, 400);
});

test("POST /stands - token válido de artesano sin permisos", async () => {
  const { artesano } = obtenerTokensPrueba();
  const respuesta = await peticion("post", "/stands")
    .set("Authorization", `Bearer ${artesano}`)
    .send({});

  assert.equal(respuesta.status, 403);
});
