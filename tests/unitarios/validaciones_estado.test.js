import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  actualizarActivoSchema,
} from "../../src/validators/estado.schema.js";

describe("Validaciones de Estado", () => {

  // ACTUALIZAR ACTIVO SCHEMA
  describe("actualizarActivoSchema", () => {

    it("debe aceptar el valor true", () => {
      const resultado = actualizarActivoSchema.safeParse({
        activo: true,
      });

      assert.equal(resultado.success, true);
    });

    it("debe aceptar el valor false", () => {
      const resultado = actualizarActivoSchema.safeParse({
        activo: false,
      });

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un valor que no sea booleano", () => {
      const resultado = actualizarActivoSchema.safeParse({
        activo: "true",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un número como valor de activo", () => {
      const resultado = actualizarActivoSchema.safeParse({
        activo: 1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia de activo", () => {
      const resultado = actualizarActivoSchema.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = actualizarActivoSchema.safeParse({
        activo: true,
        nombre: "Juan",
      });

      assert.equal(resultado.success, false);
    });

  });

});
