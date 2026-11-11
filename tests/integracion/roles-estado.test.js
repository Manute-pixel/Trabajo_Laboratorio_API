import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import { cambiarActivo } from "../../src/services/estado.service.js";
import { asignarAdministrador, retirarRol } from "../../src/services/roles.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de roles", () => {
test("Asigna el rol administrador de forma idempotente", async () => {
  await asignarAdministrador(contexto.usuarioArtesano.id);
  await asignarAdministrador(contexto.usuarioArtesano.id);

  const asignaciones = await prisma.usuarioRol.findMany({
    where: {
      usuarioId: contexto.usuarioArtesano.id,
      rolId: contexto.roles.ADMINISTRADOR.id,
    },
  });
  assert.equal(asignaciones.length, 1);

  await assert.rejects(
    asignarAdministrador("00000000-0000-4000-8000-000000000000"),
    (error) => error.status === 404,
  );
});

test("Retirar roles rechaza usuarios inexistentes y no deja usuarios sin roles", async () => {
  const soloArtesano = await prisma.usuario.create({
    data: {
      nombre_usuario: "Artesano",
      apellido_usuario: "Sin otros roles",
      email_usuario: `${contexto.prefijo}-solo-artesano@example.test`,
      password: "hash-de-prueba",
      roles: { create: { rolId: contexto.roles.ARTESANO.id } },
    },
  });

  await assert.rejects(
    retirarRol("00000000-0000-4000-8000-000000000000", "ARTESANO"),
    (error) => error.status === 404,
  );
  await assert.rejects(
    retirarRol(soloArtesano.id, "ARTESANO"),
    (error) => error.status === 409,
  );

  assert.equal(
    await retirarRol(contexto.usuarioArtesano.id, "ROL_INEXISTENTE"),
    undefined,
  );
});
});

describe("servicio de estado", () => {
test("Cambia el estado de usuarios sin desactivar al último administrador", async () => {
  const desactivado = await cambiarActivo(contexto.usuarioArtesano.id, false);
  assert.equal(desactivado.activo, false);

  const reactivado = await cambiarActivo(contexto.usuarioArtesano.id, true);
  assert.equal(reactivado.activo, true);

  await assert.rejects(
    cambiarActivo("00000000-0000-4000-8000-000000000000", false),
    (error) => error.status === 404,
  );

  await cambiarActivo(contexto.otroAdmin.id, false);
  const administradoresActivos = await prisma.usuario.count({
    where: {
      activo: true,
      roles: { some: { rol: { nombre_rol: "ADMINISTRADOR" } } },
    },
  });

  if (administradoresActivos === 1) {
    await assert.rejects(
      cambiarActivo(contexto.usuarioAdmin.id, false),
      (error) => error.status === 409,
    );
    const administrador = await prisma.usuario.findUnique({
      where: { id: contexto.usuarioAdmin.id },
      select: { activo: true },
    });
    assert.equal(administrador.activo, true);
  } else {
    const desactivado = await cambiarActivo(contexto.usuarioAdmin.id, false);
    assert.equal(desactivado.activo, false);
  }
});
});
