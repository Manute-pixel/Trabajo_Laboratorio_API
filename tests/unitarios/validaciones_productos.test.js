import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  productoSchema,
  miProductoSchema,
  consultarProductoSchema,
  actualizarProductoSchema,
} from "../../src/validators/productos.schemas.js";

const productoValido = {
  nombre: "Mate artesanal",
  descripcion: "Mate de cerámica pintado a mano",
  precio: 15000,
  categoriaId: 1,
  artesanoId: 2,
};

describe("Validaciones de Productos", () => {

  // PRODUCTO SCHEMA
  describe("productoSchema", () => {

    it("debe aceptar un producto con datos válidos", () => {
      const resultado = productoSchema.safeParse(productoValido);

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un nombre vacío", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        nombre: "   ",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una descripción vacía", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        descripcion: "",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un precio negativo", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        precio: -100,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un precio con más de dos decimales", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        precio: 10.999,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una categoría inválida", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        categoriaId: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un artesano inválido", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        artesanoId: -1,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = productoSchema.safeParse({
        ...productoValido,
        propiedadExtra: "dato",
      });

      assert.equal(resultado.success, false);
    });

  });

  // MI PRODUCTO SCHEMA
  describe("miProductoSchema", () => {

    const miProductoValido = {
      nombre: "Mate artesanal",
      descripcion: "Mate de cerámica",
      precio: 15000,
      categoriaId: 1,
    };

    it("debe aceptar un producto propio válido", () => {
      const resultado = miProductoSchema.safeParse(miProductoValido);

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un producto con nombre vacío", () => {
      const resultado = miProductoSchema.safeParse({
        ...miProductoValido,
        nombre: "",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un precio igual a cero", () => {
      const resultado = miProductoSchema.safeParse({
        ...miProductoValido,
        precio: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar el campo artesanoId porque no está permitido", () => {
      const resultado = miProductoSchema.safeParse({
        ...miProductoValido,
        artesanoId: 2,
      });

      assert.equal(resultado.success, false);
    });

  });

  // CONSULTAR PRODUCTO SCHEMA
  describe("consultarProductoSchema", () => {

    it("debe aceptar criterios de búsqueda válidos", () => {
      const resultado = consultarProductoSchema.safeParse({
        nombre: "Mate",
        precioMin: 1000,
        precioMax: 20000,
        categoriaId: 1,
        artesanoId: 2,
        ordenPor: "precio",
        direccion: "desc",
        pagina: 2,
        limite: 10,
      });

      assert.equal(resultado.success, true);
    });

    it("debe aceptar una consulta sin filtros y aplicar valores predeterminados", () => {
      const resultado = consultarProductoSchema.safeParse({});

      assert.equal(resultado.success, true);

      assert.deepEqual(resultado.data, {
        ordenPor: "nombre",
        direccion: "asc",
        pagina: 1,
        limite: 10,
      });
    });

    it("debe rechazar una página igual a cero", () => {
      const resultado = consultarProductoSchema.safeParse({
        pagina: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un límite mayor a 50", () => {
      const resultado = consultarProductoSchema.safeParse({
        limite: 51,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar un criterio de ordenamiento inválido", () => {
      const resultado = consultarProductoSchema.safeParse({
        ordenPor: "descripcion",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una dirección de ordenamiento inválida", () => {
      const resultado = consultarProductoSchema.safeParse({
        direccion: "mayor",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = consultarProductoSchema.safeParse({
        nombre: "Mate",
        campoExtra: "dato",
      });

      assert.equal(resultado.success, false);
    });

  });

  // ACTUALIZAR PRODUCTO SCHEMA
  describe("actualizarProductoSchema", () => {

    it("debe aceptar datos completos y válidos", () => {
      const resultado = actualizarProductoSchema.safeParse(productoValido);

      assert.equal(resultado.success, true);
    });

    it("debe rechazar un nombre vacío", () => {
      const resultado = actualizarProductoSchema.safeParse({
        ...productoValido,
        nombre: "",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar una categoría inválida", () => {
      const resultado = actualizarProductoSchema.safeParse({
        ...productoValido,
        categoriaId: 0,
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar datos incompletos", () => {
      const resultado = actualizarProductoSchema.safeParse({
        nombre: "Mate artesanal",
      });

      assert.equal(resultado.success, false);
    });

    it("debe rechazar propiedades adicionales", () => {
      const resultado = actualizarProductoSchema.safeParse({
        ...productoValido,
        campoExtra: "dato",
      });

      assert.equal(resultado.success, false);
    });

  });

});