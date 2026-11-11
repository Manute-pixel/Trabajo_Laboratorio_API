import { test } from "node:test";
import assert from "node:assert/strict";
import {
  configurarPruebasRutas,
  obtenerTokensPrueba,
} from "./lifecycle.js";

const peticion = configurarPruebasRutas();

const casosProtegidos = [
  { nombre: "Listar postulaciones", metodo: "get", ruta: "/postulaciones" },
  {
    nombre: "Consultar postulación por ID",
    metodo: "get",
    ruta: "/postulaciones/1",
  },
  { nombre: "Crear postulación", metodo: "post", ruta: "/postulaciones" },
  {
    nombre: "Actualizar postulación",
    metodo: "patch",
    ruta: "/postulaciones/1",
  },
  {
    nombre: "Consultar mi postulación",
    metodo: "get",
    ruta: "/postulaciones/mi-postulacion",
  },
  {
    nombre: "Postularme a una edición",
    metodo: "post",
    ruta: "/postulaciones/postularme",
  },
  {
    nombre: "Actualizar mi postulación",
    metodo: "patch",
    ruta: "/postulaciones/actualizar-mi-postulacion",
  },
];

for (const caso of casosProtegidos) {
  test(`${caso.metodo.toUpperCase()} ${caso.ruta} - ${caso.nombre} sin token`, async () => {
    const respuesta = await peticion(caso.metodo, caso.ruta);
    assert.equal(respuesta.status, 401);
  });
}

test("GET /postulaciones - token válido de administrador", async () => {
  const { administrador } = obtenerTokensPrueba();
  const respuesta = await peticion("get", "/postulaciones")
    .set("Authorization", `Bearer ${administrador}`);

  assert.equal(respuesta.status, 200);
});
