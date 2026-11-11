import assert from "node:assert/strict";
import { randomInt } from "node:crypto";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import * as postulaciones from "../../src/services/postulaciones.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;
const edicionesExtra = [];

const crearEdicion = async (sufijo) => {
  const edicion = await prisma.edicion_Poncho.create({
    data: {
      nombre_edicion: `${contexto.prefijo}-${sufijo}`,
      anio_edicion: randomInt(100_000, 1_000_000_000),
      fecha_inicio: new Date("2099-02-01T00:00:00.000Z"),
      fecha_fin: new Date("2099-02-28T00:00:00.000Z"),
    },
  });
  edicionesExtra.push(edicion.id);
  return edicion;
};

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (edicionesExtra.length) {
    await prisma.postulacion.deleteMany({
      where: { edicionId: { in: edicionesExtra } },
    });
    await prisma.edicion_Poncho.deleteMany({
      where: { id: { in: edicionesExtra } },
    });
  }
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de postulaciones", () => {
test("Crea, lista y consulta postulaciones", async () => {
  const creada = await postulaciones.crearPostulacion({
    artesanoId: contexto.artesano.id,
    edicionId: contexto.edicion.id,
  });
  assert.ok(creada.id);
  assert.equal(creada.estado_postulacion, "PENDIENTE");
  assert.equal(creada.artesano.id, contexto.artesano.id);
  assert.equal(creada.edicion.id, contexto.edicion.id);

  const lista = await postulaciones.obtenerPostulaciones({
    artesanoId: contexto.artesano.id,
    pagina: 1,
    limite: 10,
    ordenPor: "artesanoId",
    direccion: "asc",
  });
  assert.ok(lista.postulaciones.some(({ id }) => id === creada.id));
  assert.ok(lista.paginacion.total >= 1);
  assert.equal(
    (await postulaciones.obtenerPostulacionPorId(creada.id)).id,
    creada.id,
  );
  assert.equal(
    await postulaciones.obtenerPostulacionPorId(2_000_000_000),
    null,
  );

  await assert.rejects(
    postulaciones.crearPostulacion({
      artesanoId: contexto.artesano.id,
      edicionId: contexto.edicion.id,
    }),
    (error) => error.status === 400,
  );
  await prisma.postulacion.delete({ where: { id: creada.id } });
});

test("Rechaza referencias de artesano y edición inexistentes", async () => {
  await assert.rejects(
    postulaciones.crearPostulacion({
      artesanoId: 2_000_000_000,
      edicionId: contexto.edicion.id,
    }),
    (error) => error.status === 404,
  );
  await assert.rejects(
    postulaciones.crearPostulacion({
      artesanoId: contexto.artesano.id,
      edicionId: 2_000_000_000,
    }),
    (error) => error.status === 404,
  );
});

test("Actualiza el estado de una postulación y valida los casos inválidos", async () => {
  const edicion = await crearEdicion("actualizacion-estado");
  const creada = await postulaciones.crearPostulacion({
    artesanoId: contexto.artesano.id,
    edicionId: edicion.id,
  });
  const actualizada = await postulaciones.actualizarPostulacion(
    creada.id,
    "ACEPTADO",
  );
  assert.equal(actualizada.estado_postulacion, "ACEPTADO");

  await assert.rejects(
    postulaciones.actualizarPostulacion(creada.id, "ACEPTADO"),
    (error) => error.status === 400,
  );
  await assert.rejects(
    postulaciones.actualizarPostulacion(2_000_000_000, "ACEPTADO"),
    (error) => error.status === 404,
  );
  await prisma.postulacion.delete({ where: { id: creada.id } });
});

test("Permite al artesano crear, consultar y cambiar su postulación de edición", async () => {
  const segundaEdicion = await crearEdicion("segunda-edicion");
  const terceraEdicion = await crearEdicion("tercera-edicion");
  const creada = await postulaciones.crearMiPostulacion(
    contexto.usuarioArtesano.id,
    segundaEdicion.id,
  );
  assert.equal(creada.estado_postulacion, "PENDIENTE");

  const obtenida = await postulaciones.obtenerMiPostulacion(
    contexto.usuarioArtesano.id,
  );
  assert.equal(obtenida.id, creada.id);

  const actualizada = await postulaciones.actualizarMiPostulacion(
    contexto.usuarioArtesano.id,
    { edicionId: terceraEdicion.id },
  );
  assert.equal(actualizada.edicion.id, terceraEdicion.id);

  await assert.rejects(
    postulaciones.crearMiPostulacion(
      contexto.usuarioAdmin.id,
      segundaEdicion.id,
    ),
    (error) => error.status === 400,
  );
  await assert.rejects(
    postulaciones.crearMiPostulacion(
      contexto.usuarioArtesano.id,
      2_000_000_000,
    ),
    (error) => error.status === 404,
  );
  await assert.rejects(
    postulaciones.obtenerMiPostulacion(contexto.usuarioAdmin.id),
    (error) => error.status === 404,
  );
  await assert.rejects(
    postulaciones.actualizarMiPostulacion(contexto.usuarioAdmin.id, {
      edicionId: terceraEdicion.id,
    }),
    (error) => error.status === 404,
  );
  await assert.rejects(
    postulaciones.actualizarMiPostulacion(contexto.usuarioArtesano.id, {
      edicionId: terceraEdicion.id,
    }),
    (error) => error.status === 400,
  );
});
});
