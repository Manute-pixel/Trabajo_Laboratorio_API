import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  artesanoSchema,
  consultarArtesanoSchema,
  actualizarArtesanoSchema,
} from "../../src/validators/artesanos.schemas.js";

const artesanoValido = {
  nombre: "Guadalupe",
  apellido: "Toloza",
  dni: "40123456",
  email: "guadalupe@gmail.com",
  fechaNac: "2000-05-15",
  telefono: "3834123456",
  rubroId: 1,
  localidadId: 2,
  provinciaId: 3,
};

describe("Validaciones de Artesanos", () => {

  // ARTESANO SCHEMA
  describe("artesanoSchema", () => {

    it("debe aceptar un artesano con datos válidos", () => {
      const resultado = artesanoSchema.safeParse(artesanoValido);
      assert.equal(resultado.success, true);
    });

    it("debe rechazar un nombre con menos de 3 caracteres", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        nombre: "Al",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un apellido con menos de 3 caracteres", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        apellido: "Ro",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un DNI con menos de 7 caracteres", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        dni: "123456",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un email inválido", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        email: "correo-invalido",
      });
      assert.equal(resultado.success, false);
    });

    it("debe transformar el email a minúsculas", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        email: "GUADALUPE@GMAIL.COM",
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.email, "guadalupe@gmail.com");
    });

    it("debe rechazar una fecha inválida", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        fechaNac: "fecha-invalida",
      });
      assert.equal(resultado.success, false);
    });

    it("debe transformar la fecha de nacimiento en un objeto Date", () => {
      const resultado = artesanoSchema.safeParse(artesanoValido);

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.fechaNac instanceof Date, true);
    });

    it("debe rechazar un teléfono con menos de 10 caracteres", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        telefono: "123456789",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un rubro igual a cero", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        rubroId: 0,
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una localidad inválida", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        localidadId: -1,
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una provincia inválida", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        provinciaId: 0,
      });
      assert.equal(resultado.success, false);
    });

    it("debe aceptar identificadores enviados como texto numérico", () => {
      const resultado = artesanoSchema.safeParse({
        ...artesanoValido,
        rubroId: "1",
        localidadId: "2",
        provinciaId: "3",
      });
      assert.equal(resultado.success, true);
    });

  });

  // CONSULTAR ARTESANO SCHEMA
  describe("consultarArtesanoSchema", () => {

    it("debe aceptar criterios de búsqueda válidos", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        nombre: "Guadalupe",
        apellido: "Toloza",
        dni: "40123456",
        email: "guadalupe@gmail.com",
        fechaNac: "2000-05-15",
        rubroId: 1,
        localidadId: 2,
        provinciaId: 3,
        ordenPor: "apellido",
        direccion: "desc",
        pagina: 2,
        limite: 10,
      });
      assert.equal(resultado.success, true);
    });

    it("debe aceptar una consulta sin filtros y aplicar valores predeterminados", () => {
      const resultado = consultarArtesanoSchema.safeParse({});

      assert.equal(resultado.success, true);
      assert.deepEqual(resultado.data, {
        ordenPor: "nombre",
        direccion: "asc",
        pagina: 1,
        limite: 10,
      });
    });

    it("debe rechazar un email inválido", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        email: "correo-invalido",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una fecha inválida", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        fechaNac: "fecha-invalida",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una página igual a cero", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        pagina: 0,
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un límite mayor a 50", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        limite: 51,
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un criterio de ordenamiento inválido", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        ordenPor: "telefono",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una dirección de ordenamiento inválida", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        direccion: "mayor",
      });
      assert.equal(resultado.success, false);
    });

    it("debe aceptar identificadores enviados como texto numérico", () => {
      const resultado = consultarArtesanoSchema.safeParse({
        rubroId: "1",
        localidadId: "2",
        provinciaId: "3",
      });
      assert.equal(resultado.success, true);
    });

  });

  // ACTUALIZAR ARTESANO SCHEMA
  describe("actualizarArtesanoSchema", () => {

    it("debe aceptar datos válidos para actualizar", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        nombre: "Nuevo nombre",
      });
      assert.equal(resultado.success, true);
    });

    it("debe aceptar varios campos válidos para actualizar", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        nombre: "Nuevo nombre",
        apellido: "Nuevo apellido",
        telefono: "3834123456",
      });
      assert.equal(resultado.success, true);
    });

    it("debe rechazar una actualización sin datos", () => {
      const resultado = actualizarArtesanoSchema.safeParse({});
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un nombre con menos de 3 caracteres", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        nombre: "Al",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un email inválido", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        email: "correo-invalido",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar una fecha inválida", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        fechaNac: "fecha-invalida",
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar un rubro inválido", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        rubroId: 0,
      });
      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = actualizarArtesanoSchema.safeParse({
        nombre: "Guadalupe",
        campoExtra: "dato",
      });
      assert.equal(resultado.success, false);
    });

  });

});