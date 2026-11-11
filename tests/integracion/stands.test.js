import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import * as stands from "../../src/services/stands.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

const numero = () => Math.floor(100_000 + Math.random() * 800_000);
const criterios = {
  pagina: 1,
  limite: 10,
  ordenPor: "numero",
  direccion: "asc",
};

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de stands", () => {
test("Verifica sector y artesano, incluyendo la asociación opcional", async () => {
  assert.equal(await stands.verificarSector(contexto.sector.id), undefined);
  assert.equal(await stands.verificarArtesano(), undefined);
  assert.equal(
    await stands.verificarArtesano(contexto.artesano.id),
    undefined,
  );

  await assert.rejects(stands.verificarSector(-1), (error) => error.status === 404);
  await assert.rejects(
    stands.verificarArtesano(2_000_000_000),
    (error) => error.status === 404,
  );
  await assert.rejects(stands.verificarSector(null), (error) => error.status === 400);
});

test("Crea, lista y consulta stands", async () => {
  const nuevoNumero = numero();
  const creado = await stands.crearStand({
    numero: nuevoNumero,
    estado: "DISPONIBLE",
    sectorId: contexto.sector.id,
  });
  assert.ok(creado.id);
  assert.equal(creado.sector.id, contexto.sector.id);

  const lista = await stands.consultarStands({
    ...criterios,
    sector: contexto.prefijo,
  });
  assert.ok(lista.stands.some(({ id }) => id === creado.id));
  assert.ok(lista.paginacion.total >= 1);

  assert.equal(
    (await stands.consultarStandPorId(creado.id)).id,
    creado.id,
  );
  assert.equal(await stands.consultarStandPorId(2_000_000_000), null);

  await assert.rejects(
    stands.crearStand({
      numero: nuevoNumero,
      estado: "DISPONIBLE",
      sectorId: contexto.sector.id,
    }),
    (error) => error.status === 400,
  );
  await assert.rejects(
    stands.crearStand({
      numero: numero(),
      estado: "DISPONIBLE",
      sectorId: 2_000_000_000,
    }),
    (error) => error.status === 404,
  );
});

test("Actualiza y elimina stands, manejando registros inexistentes y duplicados", async () => {
  const numeroUno = numero();
  const numeroDos = numero();
  const primero = await stands.crearStand({
    numero: numeroUno,
    estado: "DISPONIBLE",
    sectorId: contexto.sector.id,
  });
  const segundo = await stands.crearStand({
    numero: numeroDos,
    estado: "DISPONIBLE",
    sectorId: contexto.sector.id,
  });

  const actualizado = await stands.actualizarStand(primero.id, {
    numero: numeroUno,
    estado: "OCUPADO",
    sectorId: contexto.sector.id,
    artesanoId: contexto.artesano.id,
  });
  assert.equal(actualizado.estado_stand, "OCUPADO");
  assert.equal(actualizado.artesanoId, contexto.artesano.id);

  await assert.rejects(
    stands.actualizarStand(segundo.id, {
      numero: numeroUno,
      estado: "DISPONIBLE",
      sectorId: contexto.sector.id,
      artesanoId: null,
    }),
    (error) => error.status === 400,
  );
  assert.equal(
    await stands.actualizarStand(2_000_000_000, {
      numero: numero(),
      estado: "DISPONIBLE",
      sectorId: contexto.sector.id,
      artesanoId: null,
    }),
    null,
  );
  await assert.rejects(
    stands.actualizarStand(segundo.id, {
      numero: numero(),
      estado: "DISPONIBLE",
      sectorId: 2_000_000_000,
      artesanoId: null,
    }),
    (error) => error.status === 404,
  );

  assert.equal((await stands.eliminarStand(segundo.id)).id, segundo.id);
  assert.equal(await stands.eliminarStand(segundo.id), null);
});

test("Asocia y desvincula stands, rechazando estados inválidos", async () => {
  const stand = await stands.crearStand({
    numero: numero(),
    estado: "DISPONIBLE",
    sectorId: contexto.sector.id,
  });

  const asociado = await stands.asociarStand(stand.id, contexto.artesano.id);
  assert.equal(asociado.artesanoId, contexto.artesano.id);
  assert.equal(asociado.estado_stand, "OCUPADO");

  await assert.rejects(
    stands.asociarStand(stand.id, contexto.artesano.id),
    (error) => error.status === 400,
  );
  await assert.rejects(
    stands.asociarStand(2_000_000_000, contexto.artesano.id),
    (error) => error.status === 404,
  );

  const desvinculado = await stands.desvincularStand(stand.id);
  assert.equal(desvinculado.artesanoId, null);
  assert.equal(desvinculado.estado_stand, "DISPONIBLE");

  await assert.rejects(
    stands.desvincularStand(stand.id),
    (error) => error.status === 400,
  );
  await assert.rejects(
    stands.desvincularStand(2_000_000_000),
    (error) => error.status === 404,
  );
});
});
