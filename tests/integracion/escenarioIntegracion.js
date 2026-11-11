import { randomInt, randomUUID } from "node:crypto";
import bcrypt from "bcrypt";

export const crearContextoIntegracion = async (prisma) => {
  const prefijo = `it-${randomUUID()}`;
  const roles = {};

  for (const nombre of ["ADMINISTRADOR", "ARTESANO"]) {
    roles[nombre] = await prisma.rol.upsert({
      where: { nombre_rol: nombre },
      update: {},
      create: { nombre_rol: nombre },
    });
  }

  const [provincia, localidad, rubro, categoria, edicion] = await Promise.all([
    prisma.provincia.create({
      data: { nombre_provincia: `${prefijo}-provincia` },
    }),
    prisma.localidad.create({
      data: { nombre_localidad: `${prefijo}-localidad` },
    }),
    prisma.rubro.create({
      data: { nombre_rubro: `${prefijo}-rubro` },
    }),
    prisma.categoria_Producto.create({
      data: { nombre_categoria: `${prefijo}-categoria` },
    }),
    prisma.edicion_Poncho.create({
      data: {
        nombre_edicion: `${prefijo}-edicion`,
        anio_edicion: randomInt(100_000, 1_000_000_000),
        fecha_inicio: new Date("2099-01-01T00:00:00.000Z"),
        fecha_fin: new Date("2099-01-31T00:00:00.000Z"),
      },
    }),
  ]);

  const pabellon = await prisma.pabellon.create({
    data: {
      nombre_pabellon: `${prefijo}-pabellon`,
      edicionId: edicion.id,
    },
  });
  const sector = await prisma.sector.create({
    data: {
      nombre_sector: `${prefijo}-sector`,
      pabellonId: pabellon.id,
    },
  });

  const password = await bcrypt.hash("Password123!", 4);
  const usuarioArtesano = await prisma.usuario.create({
    data: {
      nombre_usuario: "Artesano",
      apellido_usuario: "Integracion",
      email_usuario: `${prefijo}-artesano@example.test`,
      password,
      roles: { create: { rolId: roles.ARTESANO.id } },
      artesano: {
        create: {
          nombre_artesano: "Artesano",
          apellido_artesano: "Integracion",
          dni: `${Math.floor(10_000_000 + Math.random() * 89_999_999)}`,
          fecha_Nacimiento: new Date("1990-01-01T00:00:00.000Z"),
          rubroId: rubro.id,
          localidadId: localidad.id,
          provinciaId: provincia.id,
          email_artesano: `${prefijo}-artesano@example.test`,
          telefono_artesano: "3834000000",
        },
      },
    },
    include: { artesano: true },
  });

  const crearAdministrador = async (sufijo = "admin") =>
    prisma.usuario.create({
      data: {
        nombre_usuario: "Administrador",
        apellido_usuario: "Integracion",
        email_usuario: `${prefijo}-${sufijo}@example.test`,
        password,
        roles: { create: { rolId: roles.ADMINISTRADOR.id } },
      },
    });

  const usuarioAdmin = await crearAdministrador();
  const otroAdmin = await crearAdministrador("otro-admin");

  return {
    prefijo,
    roles,
    provincia,
    localidad,
    rubro,
    categoria,
    edicion,
    pabellon,
    sector,
    usuarioArtesano,
    artesano: usuarioArtesano.artesano,
    usuarioAdmin,
    otroAdmin,
    password: "Password123!",
    crearAdministrador,
    limpiar: async () => {
      const usuarios = await prisma.usuario.findMany({
        where: { email_usuario: { startsWith: `${prefijo}-` } },
        select: { id: true },
      });
      const usuarioIds = usuarios.map(({ id }) => id);
      const artesanos = await prisma.artesano.findMany({
        where: { usuarioId: { in: usuarioIds } },
        select: { id: true },
      });
      const artesanoIds = artesanos.map(({ id }) => id);

      await prisma.postulacion.deleteMany({
        where: {
          OR: [
            { artesanoId: { in: artesanoIds } },
            { edicionId: edicion.id },
          ],
        },
      });
      await prisma.consulta.deleteMany({
        where: { tipo_consulta: { startsWith: `${prefijo}-` } },
      });
      await prisma.producto.deleteMany({
        where: { artesanoId: { in: artesanoIds } },
      });
      await prisma.stand.deleteMany({
        where: {
          OR: [
            { sectorId: sector.id },
            { artesanoId: { in: artesanoIds } },
          ],
        },
      });
      await prisma.artesano.deleteMany({
        where: { usuarioId: { in: usuarioIds } },
      });
      await prisma.usuario.deleteMany({
        where: { id: { in: usuarioIds } },
      });
      await prisma.sector.deleteMany({ where: { id: sector.id } });
      await prisma.pabellon.deleteMany({ where: { id: pabellon.id } });
      await prisma.edicion_Poncho.deleteMany({
        where: { id: edicion.id },
      });
      await prisma.categoria_Producto.deleteMany({
        where: { id: categoria.id },
      });
      await prisma.provincia.deleteMany({ where: { id: provincia.id } });
      await prisma.localidad.deleteMany({ where: { id: localidad.id } });
      await prisma.rubro.deleteMany({ where: { id: rubro.id } });
    },
  };
};
