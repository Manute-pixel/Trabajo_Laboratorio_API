import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import prisma from "../../src/config/prisma.js";
import { crearConsulta } from "../../src/services/consulta.service.js";
import * as reportes from "../../src/services/reportes.service.js";
import { crearContextoIntegracion } from "./escenarioIntegracion.js";

let contexto;

before(async () => {
  contexto = await crearContextoIntegracion(prisma);
});

after(async () => {
  if (contexto) await contexto.limpiar();
  await prisma.$disconnect();
});

describe("servicio de reportes", () => {
test("Genera reportes de artesanos por localidad, rubro y productos", async () => {
  const producto = await prisma.producto.create({
    data: {
      nombre_producto: `${contexto.prefijo}-producto`,
      descripcion: "Producto para reportes",
      precio_producto: 100,
      categoriaId: contexto.categoria.id,
      artesanoId: contexto.artesano.id,
    },
  });

  const total = await prisma.artesano.count();
  assert.deepEqual(await reportes.obtenerTotalArtesanos(), {
    totalArtesanos: total,
  });

  const localidades = await reportes.obtenerArtesanosLocalidad();
  assert.ok(
    localidades.some(
      ({ localidad, totalArtesanos }) =>
        localidad === contexto.localidad.nombre_localidad &&
        totalArtesanos === 1,
    ),
  );

  const rubros = await reportes.obtenerArtesanosRubro();
  assert.ok(
    rubros.some(
      ({ rubro, totalArtesanos }) =>
        rubro === contexto.rubro.nombre_rubro && totalArtesanos === 1,
    ),
  );

  const porArtesano = await reportes.obtenerProductoArtesano();
  assert.ok(
    porArtesano.some(
      ({ dni, totalProductos }) =>
        dni === contexto.artesano.dni && totalProductos === 1,
    ),
  );
  assert.ok(producto.id);
});

test("Genera el reporte agregado de stands por estado", async () => {
  await prisma.stand.createMany({
    data: [
      {
        numero_stand: 800_001,
        estado_stand: "DISPONIBLE",
        sectorId: contexto.sector.id,
      },
      {
        numero_stand: 800_002,
        estado_stand: "OCUPADO",
        sectorId: contexto.sector.id,
        artesanoId: contexto.artesano.id,
      },
    ],
  });

  const totalStands = await prisma.stand.count();
  const disponibles = await prisma.stand.count({
    where: { estado_stand: "DISPONIBLE" },
  });
  const ocupados = await prisma.stand.count({
    where: { estado_stand: "OCUPADO" },
  });
  assert.deepEqual(await reportes.obtenerReporteStands(), {
    totalStands,
    disponibles,
    ocupados,
  });
});
});

describe("servicio de consultas", () => {
test("Registra consultas serializando los criterios recibidos", async () => {
  const criterios = { nombre: "tejido", pagina: 2 };
  const tipoConsulta = `${contexto.prefijo}-productos`;
  const resultado = await crearConsulta(tipoConsulta, criterios);

  assert.equal(resultado, JSON.stringify(criterios));
  const guardada = await prisma.consulta.findFirst({
    where: {
      tipo_consulta: tipoConsulta,
      busqueda_realizada: JSON.stringify(criterios),
    },
    orderBy: { id: "desc" },
  });
  assert.ok(guardada);
});
});
