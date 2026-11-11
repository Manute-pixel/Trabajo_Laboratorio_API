import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  asignarAdministradorSchema,
  retirarRolParametrosSchema,
} from "../../src/validators/roles.schema.js";

describe("Validaciones de Roles", () => {

  // ASIGNAR ADMINISTRADOR SCHEMA
  describe("asignarAdministradorSchema", () => {

    it("debe aceptar el rol ADMINISTRADOR", () => {
      const resultado = asignarAdministradorSchema.safeParse({
        rol: "ADMINISTRADOR",
      });

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un rol diferente de ADMINISTRADOR", () => {
      const resultado = asignarAdministradorSchema.safeParse({
        rol: "ARTESANO",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un rol vacío", () => {
      const resultado = asignarAdministradorSchema.safeParse({
        rol: "",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia del rol", () => {
      const resultado = asignarAdministradorSchema.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = asignarAdministradorSchema.safeParse({
        rol: "ADMINISTRADOR",
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      assert.equal(resultado.success, false);
    });

  });

  // RETIRAR ROL PARAMETROS SCHEMA
  describe("retirarRolParametrosSchema", () => {

    it("debe aceptar un UUID y el rol ARTESANO", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        rol: "ARTESANO",
      });

      assert.equal(resultado.success, true);
    });

    it("debe aceptar un UUID y el rol ADMINISTRADOR", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        rol: "ADMINISTRADOR",
      });

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un UUID inválido", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "12345",
        rol: "ARTESANO",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un rol diferente de ARTESANO o ADMINISTRADOR", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        rol: "USUARIO",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia del ID", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        rol: "ARTESANO",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar la ausencia del rol", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = retirarRolParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        rol: "ARTESANO",
        otroDato: "valor",
      });

      assert.equal(resultado.success, false);
    });

  });

});
