import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  standConsultaSchema,
  standCreacionSchema,
  standActualizacionSchema,
  standAsignacionSchema
} from "../../src/validators/stand.schema.js";

// CONSULTA DE STANDS
describe("standConsultaSchema", () => {

  it("Debe aceptar una consulta sin parámetros y aplicar valores predeterminados", () => {
    const resultado = standConsultaSchema.safeParse({});

    assert.equal(resultado.success, true);
    assert.equal(resultado.data.pagina, 1);
    assert.equal(resultado.data.limite, 10);
    assert.equal(resultado.data.ordenPor, "fecha");
    assert.equal(resultado.data.direccion, "asc");
  });

  it("Debe aceptar parámetros de consulta válidos", () => {
    const resultado = standConsultaSchema.safeParse({
      pagina: 2,
      limite: 20,
      ordenPor: "numero",
      direccion: "desc",
      numero: 5,
      estado: "disponible",
      sector: "Norte",
      pabellon: "A",
      edicion: "2026",
      artesano: "Juan Perez",
      fecha: "2026-11-10",
      fechaDesde: "2026-11-01",
      fechaHasta: "2026-11-30"
    });

    assert.equal(resultado.success, true);
  });

  it("Debe convertir los parámetros numéricos de texto a números", () => {
    const resultado = standConsultaSchema.safeParse({
      pagina: "2",
      limite: "15",
      numero: "5"
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.data.pagina, 2);
    assert.equal(resultado.data.limite, 15);
    assert.equal(resultado.data.numero, 5);
  });

  it("Debe rechazar una página igual a cero", () => {
    const resultado = standConsultaSchema.safeParse({
      pagina: 0
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un límite igual a cero", () => {
    const resultado = standConsultaSchema.safeParse({
      limite: 0
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un número negativo", () => {
    const resultado = standConsultaSchema.safeParse({
      numero: -1
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un ordenPor no permitido", () => {
    const resultado = standConsultaSchema.safeParse({
      ordenPor: "nombre"
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar una dirección diferente de asc o desc", () => {
    const resultado = standConsultaSchema.safeParse({
      direccion: "random"
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un estado no permitido", () => {
    const resultado = standConsultaSchema.safeParse({
      estado: "reservado"
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar una fecha inválida", () => {
    const resultado = standConsultaSchema.safeParse({
      fecha: "fecha-invalida"
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un sector vacío", () => {
    const resultado = standConsultaSchema.safeParse({
      sector: "   "
    });

    assert.equal(resultado.success, false);
  });

  it("Debe eliminar los espacios al principio y al final del sector", () => {
    const resultado = standConsultaSchema.safeParse({
      sector: "  Norte  "
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.data.sector, "Norte");
  });

  it("Debe rechazar propiedades adicionales", () => {
    const resultado = standConsultaSchema.safeParse({
      pagina: 1,
      datoExtra: "no permitido"
    });

    assert.equal(resultado.success, false);
  });
});

// CREACIÓN DE STANDS
describe("standCreacionSchema", () => {

  it("Debe aceptar datos válidos para crear un stand", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 1,
      sectorId: 2
    });

    assert.equal(resultado.success, true);
  });

  it("Debe convertir los valores numéricos de texto a números", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: "1",
      sectorId: "2"
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.data.numero, 1);
    assert.equal(resultado.data.sectorId, 2);
  });

  it("Debe rechazar un número igual a cero", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 0,
      sectorId: 2
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un sectorId igual a cero", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 1,
      sectorId: 0
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar valores decimales", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 1.5,
      sectorId: 2
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar datos incompletos", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 1
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar propiedades adicionales", () => {
    const resultado = standCreacionSchema.safeParse({
      numero: 1,
      sectorId: 2,
      estado: "disponible"
    });

    assert.equal(resultado.success, false);
  });
});

// ACTUALIZACIÓN DE STANDS
describe("standActualizacionSchema", () => {

  it("Debe aceptar datos válidos para actualizar un stand", () => {
    const resultado = standActualizacionSchema.safeParse({
      numero: 3,
      sectorId: 1
    });

    assert.equal(resultado.success, true);
  });

  it("Debe rechazar una actualización sin número", () => {
    const resultado = standActualizacionSchema.safeParse({
      sectorId: 1
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar una actualización sin sectorId", () => {
    const resultado = standActualizacionSchema.safeParse({
      numero: 3
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un número negativo", () => {
    const resultado = standActualizacionSchema.safeParse({
      numero: -3,
      sectorId: 1
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar propiedades adicionales", () => {
    const resultado = standActualizacionSchema.safeParse({
      numero: 3,
      sectorId: 1,
      estado: "ocupado"
    });

    assert.equal(resultado.success, false);
  });
});

// ASIGNACIÓN DE STANDS
describe("standAsignacionSchema", () => {

  it("Debe aceptar un artesanoId válido", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: 5
    });

    assert.equal(resultado.success, true);
  });

  it("Debe convertir artesanoId de texto a número", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: "5"
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.data.artesanoId, 5);
  });

  it("Debe rechazar un artesanoId igual a cero", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: 0
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un artesanoId negativo", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: -5
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar un artesanoId decimal", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: 2.5
    });

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar la ausencia de artesanoId", () => {
    const resultado = standAsignacionSchema.safeParse({});

    assert.equal(resultado.success, false);
  });

  it("Debe rechazar propiedades adicionales", () => {
    const resultado = standAsignacionSchema.safeParse({
      artesanoId: 5,
      estado: "ocupado"
    });

    assert.equal(resultado.success, false);
  });
});
