import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import * as artesanos from "../../src/services/artesanos.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

const datosArtesano = (email, dni) => ({
  nombre: "Artesano",
  apellido: "Actualizado",
  dni,
  email,
  telefono: "3834111222",
  fechaNac: new Date("1991-04-05T00:00:00.000Z"),
  rubroId: contexto.rubro.id,
  localidadId: contexto.localidad.id,
  provinciaId: contexto.provincia.id,
});

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de artesanos", () => {
test("Verifica las referencias de provincia, localidad y rubro", async () => {
  assert.equal(await artesanos.verificarProvincia(contexto.provincia.id), undefined);
  assert.equal(await artesanos.verificarLocalidad(contexto.localidad.id), undefined);
  assert.equal(await artesanos.verificarRubro(contexto.rubro.id), undefined);

  await assert.rejects(artesanos.verificarProvincia(-1), (error) => error.status === 404);
  await assert.rejects(artesanos.verificarLocalidad(-1), (error) => error.status === 404);
  await assert.rejects(artesanos.verificarRubro(-1), (error) => error.status === 404);
});

test("Consulta artesanos con filtros y devuelve paginación", async () => {
  const resultado = await artesanos.consultarArtesanos({
    nombre: "Artesano",
    pagina: 1,
    limite: 10,
    ordenPor: "nombre",
    direccion: "asc",
  });

  assert.ok(resultado.artesanos.some(({ id }) => id === contexto.artesano.id));
  assert.equal(resultado.paginacion.pagina, 1);
  assert.ok(resultado.paginacion.total >= 1);

  const sinResultados = await artesanos.consultarArtesanos({
    nombre: `${contexto.prefijo}-no-existe`,
    pagina: 1,
    limite: 10,
    ordenPor: "nombre",
    direccion: "asc",
  });
  assert.equal(sinResultados.artesanos.length, 0);
  assert.equal(sinResultados.paginacion.total, 0);
});

test("Obtiene un artesano por id", async () => {
  const encontrado = await artesanos.consultarArtesanoPorId(contexto.artesano.id);
  assert.equal(encontrado.id, contexto.artesano.id);
});

test("Rechaza la creación de artesanos con DNI duplicado", async () => {
  await assert.rejects(
    artesanos.crearArtesano(
      datosArtesano(
        `${contexto.prefijo}-duplicado@example.test`,
        contexto.artesano.dni,
      ),
    ),
    (error) => error.status === 400,
  );
});

test("Actualiza un artesano y rechaza ids inexistentes", async () => {
  const datos = datosArtesano(
    contexto.artesano.email_artesano,
    contexto.artesano.dni,
  );
  const actualizado = await artesanos.actualizarArtesano(
    contexto.artesano.id,
    datos,
  );
  assert.equal(actualizado.apellido_artesano, datos.apellido);

  await assert.rejects(
    artesanos.actualizarArtesano(2_000_000_000, datos),
    (error) => error.status === 404,
  );
});

test("Elimina un artesano existente", async () => {
  const usuario = await contexto.crearAdministrador("artesano-a-eliminar");
  const artesano = await prisma.artesano.create({
    data: {
      nombre_artesano: "A eliminar",
      apellido_artesano: "Integracion",
      dni: `${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
      fecha_Nacimiento: new Date("1991-04-05T00:00:00.000Z"),
      rubroId: contexto.rubro.id,
      localidadId: contexto.localidad.id,
      provinciaId: contexto.provincia.id,
      email_artesano: `${contexto.prefijo}-eliminar@example.test`,
      telefono_artesano: "3834111222",
      usuarioId: usuario.id,
    },
  });

  const eliminado = await artesanos.eliminarArtesano(artesano.id);
  assert.equal(eliminado.id, artesano.id);
  await assert.rejects(
    artesanos.eliminarArtesano(artesano.id),
    (error) => error.status === 404,
  );
});

test("Asigna y obtiene el perfil de artesano asociado a un usuario administrador", async () => {
  const usuario = await contexto.crearAdministrador("asignar-artesano");
  const dto = datosArtesano(
    `${contexto.prefijo}-asignado@example.test`,
    `${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
  );

  const asignado = await artesanos.asignarArtesano(usuario.id, dto);
  assert.ok(asignado.id);
  assert.equal(asignado.email_artesano, dto.email);

  const obtenido = await artesanos.obtenerMiArtesano(usuario.id);
  assert.equal(obtenido.id, asignado.id);
  assert.equal(obtenido.usuario.id, usuario.id);

  await assert.rejects(
    artesanos.asignarArtesano("00000000-0000-4000-8000-000000000000", dto),
    (error) => error.status === 404,
  );
  await assert.rejects(
    artesanos.asignarArtesano(contexto.usuarioArtesano.id, dto),
    (error) => error.status === 409,
  );
  await assert.rejects(
    artesanos.obtenerMiArtesano(randomUUID()),
    (error) => error.status === 404,
  );
});
});
