import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  postulacionSchema,
  actualizarPostulacionSchemaAdmin,
  actualizarPostulacionSchemaArtesano,
  consultarPostulacionSchema,
  MipostulacionSchema,
} from "../../src/validators/postulaciones.schemas.js";

describe("Validaciones de Postulaciones", () => {

  // POSTULACION SCHEMA
  describe("postulacionSchema", () => {

    it("debe aceptar una postulación con datos válidos", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 1,
        edicionId: 2,
      });

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un artesanoId igual a cero", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 0,
        edicionId: 2,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un edicionId negativo", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 1,
        edicionId: -2,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar identificadores decimales", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 1.5,
        edicionId: 2,
      });

      assert.equal(resultado.success, false);
    });

    it("debe aceptar identificadores enviados como texto numérico", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: "1",
        edicionId: "2",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.artesanoId, 1);
      assert.equal(resultado.data.edicionId, 2);
    });

    it("debe rechazar la ausencia de identificadores", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = postulacionSchema.safeParse({
        artesanoId: 1,
        edicionId: 2,
        estado: "pendiente",
      });

      assert.equal(resultado.success, false);
    });

  });

  // ACTUALIZAR POSTULACION ADMIN SCHEMA
  describe("actualizarPostulacionSchemaAdmin", () => {

    it("debe aceptar el estado pendiente", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "pendiente",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "PENDIENTE");
    });

    it("debe aceptar el estado aceptado", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "aceptado",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "ACEPTADO");
    });

    it("debe aceptar el estado rechazado", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "rechazado",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "RECHAZADO");
    });

    it("debe aceptar el estado corregir", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "corregir",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "CORREGIR");
    });

    it("debe transformar el estado a mayúsculas", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "aceptado",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "ACEPTADO");
    });

    it("debe rechazar un estado inválido", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "cancelado",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia del estado", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = actualizarPostulacionSchemaAdmin.safeParse({
        estado: "aceptado",
        edicionId: 1,
      });

      assert.equal(resultado.success, false);
    });

  });

  // ACTUALIZAR POSTULACION ARTESANO SCHEMA
  describe("actualizarPostulacionSchemaArtesano", () => {

    it("debe aceptar un edicionId válido", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({
        edicionId: 1,
      });

      assert.equal(resultado.success, true);
    });

    it("debe aceptar un edicionId enviado como texto numérico", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({
        edicionId: "1",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.edicionId, 1);
    });

    it("debe rechazar un edicionId igual a cero", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({
        edicionId: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un edicionId negativo", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({
        edicionId: -1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia de edicionId", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = actualizarPostulacionSchemaArtesano.safeParse({
        edicionId: 1,
        estado: "aceptado",
      });

      assert.equal(resultado.success, false);
    });

  });

  // CONSULTAR POSTULACION SCHEMA
  describe("consultarPostulacionSchema", () => {

    it("debe aceptar criterios de búsqueda válidos", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        artesanoId: 1,
        edicionId: 2,
        estado: "aceptado",
        ordenPor: "estado",
        direccion: "desc",
        pagina: 2,
        limite: 20,
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "ACEPTADO");
    });

    it("debe aceptar una consulta sin filtros y aplicar valores predeterminados", () => {
      const resultado = consultarPostulacionSchema.safeParse({});

      assert.equal(resultado.success, true);

      assert.deepEqual(resultado.data, {
        ordenPor: "artesanoId",
        direccion: "asc",
        pagina: 1,
        limite: 10,
      });
    });

    it("debe transformar el estado a mayúsculas", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        estado: "pendiente",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.estado, "PENDIENTE");
    });

    it("debe rechazar un estado inválido", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        estado: "cancelado",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un artesanoId igual a cero", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        artesanoId: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un edicionId negativo", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        edicionId: -1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un criterio de ordenamiento inválido", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        ordenPor: "fecha",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una dirección de ordenamiento inválida", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        direccion: "mayor",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una página igual a cero", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        pagina: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un límite mayor a 50", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        limite: 51,
      });

      assert.equal(resultado.success, false);
    });

    it("debe aceptar identificadores enviados como texto numérico", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        artesanoId: "1",
        edicionId: "2",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.artesanoId, 1);
      assert.equal(resultado.data.edicionId, 2);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = consultarPostulacionSchema.safeParse({
        estado: "pendiente",
        otroDato: "valor",
      });

      assert.equal(resultado.success, false);
    });

  });

  // MI POSTULACION SCHEMA
  describe("MipostulacionSchema", () => {

    it("debe aceptar un edicionId válido", () => {
      const resultado = MipostulacionSchema.safeParse({
        edicionId: 1,
      });

      assert.equal(resultado.success, true);
    });

    it("debe aceptar un edicionId enviado como texto numérico", () => {
      const resultado = MipostulacionSchema.safeParse({
        edicionId: "1",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.edicionId, 1);
    });

    it("debe rechazar un edicionId igual a cero", () => {
      const resultado = MipostulacionSchema.safeParse({
        edicionId: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un edicionId negativo", () => {
      const resultado = MipostulacionSchema.safeParse({
        edicionId: -1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia de edicionId", () => {
      const resultado = MipostulacionSchema.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = MipostulacionSchema.safeParse({
        edicionId: 1,
        artesanoId: 2,
      });

      assert.equal(resultado.success, false);
    });

  });

});