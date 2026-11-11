import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import {
  iniciarSesion,
  obtenerUsuarioPorId,
  registrarAdministrador,
  registrarUsuarioArtesano,
} from "../../src/services/usuarios.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de usuarios", () => {
  const casosRegistroAdmin = [
    {
      descripcion: "registra un administrador correctamente",
      preparar: async () => {},
      esperado: { error: null, activo: true, rol: "ADMINISTRADOR" },
    },
    {
      descripcion: "rechaza registrar un email duplicado",
      preparar: async (email) => {
        await prisma.usuario.create({
          data: {
            nombre_usuario: "Existente",
            apellido_usuario: "Prueba",
            email_usuario: email,
            password: "hash-de-prueba",
            roles: {
              create: {
                rol: { connect: { nombre_rol: "ADMINISTRADOR" } },
              },
            },
          },
        });
      },
      esperado: { error: 409 },
    },
  ];

  for (const caso of casosRegistroAdmin) {
    test(caso.descripcion, async () => {
      const email = `${contexto.prefijo}-${randomUUID()}@test.com`;

      try {
        await caso.preparar(email);
        const dto = {
          nombre: "Admin",
          apellido: "Prueba",
          password: contexto.password,
          email,
        };

        if (caso.esperado.error !== null) {
          await assert.rejects(
            registrarAdministrador(dto),
            (error) => error.status === caso.esperado.error,
          );
          return;
        }

        const resultado = await registrarAdministrador(dto);
        assert.ok(resultado.id);

        const usuario = await prisma.usuario.findUnique({
          where: { email_usuario: email },
          include: { roles: { include: { rol: true } } },
        });
        assert.ok(usuario);
        assert.equal(usuario.activo, caso.esperado.activo);
        assert.ok(
          usuario.roles.some(
            ({ rol }) => rol.nombre_rol === caso.esperado.rol,
          ),
        );
      } finally {
        await prisma.usuario.deleteMany({
          where: { email_usuario: email },
        });
      }
    });
  }

  test("registra un artesano con contraseña cifrada", async () => {
    const email = `${contexto.prefijo}-nuevo-artesano@example.test`;
    const dni = `${Math.floor(10_000_000 + Math.random() * 89_999_999)}`;

    try {
      const resultado = await registrarUsuarioArtesano({
        nombre: "Artesana",
        apellido: "Nueva",
        email,
        password: contexto.password,
        dni,
        telefono: "3834111222",
        fechaNac: new Date("1992-03-04T00:00:00.000Z"),
        rubroId: contexto.rubro.id,
        localidadId: contexto.localidad.id,
        provinciaId: contexto.provincia.id,
      });

      assert.ok(resultado.id);
      assert.equal(resultado.email_usuario, email);
      assert.ok(resultado.artesano.id);

      const usuario = await prisma.usuario.findUnique({
        where: { id: resultado.id },
        include: { roles: { include: { rol: true } } },
      });
      assert.notEqual(usuario.password, contexto.password);
      assert.ok(
        usuario.roles.some(({ rol }) => rol.nombre_rol === "ARTESANO"),
      );
    } finally {
      const usuario = await prisma.usuario.findUnique({
        where: { email_usuario: email },
        select: { id: true },
      });
      if (usuario) {
        await prisma.artesano.deleteMany({ where: { usuarioId: usuario.id } });
        await prisma.usuario.delete({ where: { id: usuario.id } });
      }
    }
  });

  test("rechaza referencias inexistentes, email o DNI duplicado al registrar artesano", async () => {
    const base = {
      nombre: "Artesana",
      apellido: "Nueva",
      password: contexto.password,
      telefono: "3834111222",
      fechaNac: new Date("1992-03-04T00:00:00.000Z"),
      rubroId: contexto.rubro.id,
      localidadId: contexto.localidad.id,
      provinciaId: contexto.provincia.id,
    };

    await assert.rejects(
      registrarUsuarioArtesano({
        ...base,
        email: `${contexto.prefijo}-referencia@example.test`,
        dni: "no-existe",
        provinciaId: -1,
      }),
      (error) => error.status === 404,
    );
    await assert.rejects(
      registrarUsuarioArtesano({
        ...base,
        email: contexto.usuarioArtesano.email_usuario,
        dni: `${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
      }),
      (error) => error.status === 409,
    );
    await assert.rejects(
      registrarUsuarioArtesano({
        ...base,
        email: `${contexto.prefijo}-dni@example.test`,
        dni: contexto.artesano.dni,
      }),
      (error) => error.status === 409,
    );
  });

  test("valida credenciales y rechaza usuarios inexistentes o inactivos", async () => {
    const email = `${contexto.prefijo}-login@example.test`;
    let usuario;
    try {
      usuario = await registrarAdministrador({
        nombre: "Login",
        apellido: "Prueba",
        email,
        password: contexto.password,
      });

      const sesion = await iniciarSesion({
        email,
        password: contexto.password,
      });
      assert.equal(sesion.id, usuario.id);
      assert.equal(sesion.email, email);

      await assert.rejects(
        iniciarSesion({ email, password: "incorrecta" }),
        (error) => error.status === 401,
      );
      await assert.rejects(
        iniciarSesion({
          email: `${contexto.prefijo}-desconocido@example.test`,
          password: contexto.password,
        }),
        (error) => error.status === 401,
      );

      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { activo: false },
      });
      await assert.rejects(
        iniciarSesion({ email, password: contexto.password }),
        (error) => error.status === 401,
      );
    } finally {
      if (usuario?.id) {
        await prisma.usuario.delete({ where: { id: usuario.id } });
      }
    }
  });

  test("obtiene usuarios con roles normalizados y rechaza ids inexistentes", async () => {
    const resultado = await obtenerUsuarioPorId(contexto.usuarioAdmin.id);
    assert.equal(resultado.id, contexto.usuarioAdmin.id);
    assert.ok(resultado.roles.includes("ADMINISTRADOR"));

    await assert.rejects(
      obtenerUsuarioPorId(randomUUID()),
      (error) => error.status === 404,
    );
  });
});
