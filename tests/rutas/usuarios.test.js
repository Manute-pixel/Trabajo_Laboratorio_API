import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

const casosPublicos = [
  {
    nombre: "Registrar artesano sin datos",
    metodo: "post",
    ruta: "/usuarios/registro-artesano",
    datos: {},
    estado: 400,
  },
  {
    nombre: "Registrar artesano con email inválido",
    metodo: "post",
    ruta: "/usuarios/registro-artesano",
    datos: {
      nombre: "Ana",
      apellido: "García",
      dni: "12345678",
      email: "email-invalido",
      password: "Password123!",
      fechaNac: "1990-01-01",
      telefono: "3834123456",
      rubroId: 1,
      localidadId: 1,
      provinciaId: 1,
    },
    estado: 400,
  },
  {
    nombre: "Iniciar sesión sin credenciales",
    metodo: "post",
    ruta: "/usuarios/login",
    datos: {},
    estado: 400,
  },
];

for (const caso of casosPublicos) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - ${caso.nombre}`, async () => {
    const respuesta = await peticion(caso.metodo, caso.ruta)
      .send(caso.datos);

    assert.equal(respuesta.status, caso.estado);
  });
}

const casosProtegidos = [
  {
    nombre: "Consultar perfil",
    metodo: "get",
    ruta: "/usuarios/me",
  },
  {
    nombre: "Cerrar sesión",
    metodo: "post",
    ruta: "/usuarios/logout",
  },
  {
    nombre: "Registrar administrador",
    metodo: "post",
    ruta: "/usuarios/registro-administrador",
  },
  {
    nombre: "Asociar usuario con artesano",
    metodo: "post",
    ruta: "/usuarios/asignar-rolArtersano",
  },
];

for (const caso of casosProtegidos) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - sin token`, async () => {
    const respuesta = await peticion(caso.metodo, caso.ruta);
    assert.equal(respuesta.status, 401);
  });
}

const casosProtegidosRoles = [
  {
    metodo: "post",
    ruta: "/usuarios/550e8400-e29b-41d4-a716-446655440000/roles",
    nombre: "Asignar rol",
  },
  {
    metodo: "delete",
    ruta: "/usuarios/550e8400-e29b-41d4-a716-446655440000/roles/ARTESANO",
    nombre: "Eliminar rol",
  },
  {
    metodo: "patch",
    ruta: "/usuarios/550e8400-e29b-41d4-a716-446655440000/activo",
    nombre: "Actualizar estado",
  },
];

for (const caso of casosProtegidosRoles) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - ${caso.nombre} sin token`, async () => {
    const respuesta = await peticion(caso.metodo, caso.ruta);
    assert.equal(respuesta.status, 401);
  });
}

test("GET /usuarios/me - token válido", async () => {
  const { administrador } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/usuarios/me")
    .set("Authorization", `Bearer ${administrador}`);

  assert.equal(respuesta.status, 200);
  assert.ok(respuesta.body.usuario.email_usuario);
  assert.ok(respuesta.body.usuario.roles.includes("ADMINISTRADOR"));
});
