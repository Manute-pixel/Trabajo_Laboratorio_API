import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  usuarioSchema,
  inicioSesionSchema,
  usuarioIdParametrosSchema,
  registroArtesanoSchema,
  registrarAdminSchema,
  asignarArtesanoSchema
} from "../../src/validators/usuarios.schema.js";

// Datos válidos para reutilizar en las pruebas
const usuarioValido = {
  nombre: "Juan",
  apellido: "Perez",
  email: "juan@gmail.com",
  password: "12345678"
};

const artesanoValido = {
  nombre: "Guadalupe",
  apellido: "Toloza",
  dni: "12345678",
  email: "guadalupe@gmail.com",
  fechaNac: "2000-05-15",
  telefono: "3834123456",
  rubroId: 1,
  localidadId: 1,
  provinciaId: 1
};

const usuarioArtesanoValido = {
  ...usuarioValido,
  ...artesanoValido
};

describe("Validaciones de usuarios", () => {

  // USUARIO SCHEMA
  describe("usuarioSchema", () => {

    it("Debe aceptar un usuario con datos válidos", () => {
      const resultado = usuarioSchema.safeParse(usuarioValido);
      assert.equal(resultado.success, true);
    });

    it("Debe rechazar un nombre con menos de 2 caracteres", () => {
      const resultado = usuarioSchema.safeParse({
        ...usuarioValido,
        nombre: "A"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar un apellido con menos de 2 caracteres", () => {
      const resultado = usuarioSchema.safeParse({
        ...usuarioValido,
        apellido: "P"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe eliminar los espacios al principio y al final del nombre", () => {
      const resultado = usuarioSchema.safeParse({
        ...usuarioValido,
        nombre: "  Juan  "
      });

      assert.equal(resultado.success, true);
      assert.equal(resultado.data.nombre, "Juan");
    });

    it("Debe rechazar un email inválido", () => {
      const resultado = usuarioSchema.safeParse({
        ...usuarioValido,
        email: "correo-invalido"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar una contraseña con menos de 8 caracteres", () => {
      const resultado = usuarioSchema.safeParse({
        ...usuarioValido,
        password: "1234567"
      });

      assert.equal(resultado.success, false);
    });
  });

  // INICIO DE SESIÓN
  describe("inicioSesionSchema", () => {

    it("Debe aceptar credenciales válidas", () => {
      const resultado = inicioSesionSchema.safeParse({
        email: "juan@gmail.com",
        password: "12345678"
      });

      assert.equal(resultado.success, true);
    });

    it("Debe rechazar un email inválido", () => {
      const resultado = inicioSesionSchema.safeParse({
        email: "correo-invalido",
        password: "12345678"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar una contraseña vacía", () => {
      const resultado = inicioSesionSchema.safeParse({
        email: "juan@gmail.com",
        password: ""
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar una contraseña si no se envía", () => {
      const resultado = inicioSesionSchema.safeParse({
        email: "juan@gmail.com"
      });

      assert.equal(resultado.success, false);
    });
  });

  // UUID DE USUARIO
  describe("usuarioIdParametrosSchema", () => {

    it("Debe aceptar un UUID válido", () => {
      const resultado = usuarioIdParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000"
      });

      assert.equal(resultado.success, true);
    });

    it("Debe rechazar un UUID inválido", () => {
      const resultado = usuarioIdParametrosSchema.safeParse({
        id: "12345"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar la ausencia del id", () => {
      const resultado = usuarioIdParametrosSchema.safeParse({});

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar propiedades adicionales", () => {
      const resultado = usuarioIdParametrosSchema.safeParse({
        id: "550e8400-e29b-41d4-a716-446655440000",
        otroDato: "valor"
      });

      assert.equal(resultado.success, false);
    });
  });

  // REGISTRO DE ARTESANO
  describe("registroArtesanoSchema", () => {

    it("Debe aceptar los datos válidos de un usuario artesano", () => {
      const resultado = registroArtesanoSchema.safeParse(usuarioArtesanoValido);

      assert.equal(resultado.success, true);
    });

    it("Debe rechazar el registro si faltan datos del usuario", () => {
      const { nombre, ...datosIncompletos } = usuarioArtesanoValido;

      const resultado = registroArtesanoSchema.safeParse(datosIncompletos);

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar el registro si faltan datos del artesano", () => {
      const { dni, ...datosIncompletos } = usuarioArtesanoValido;

      const resultado = registroArtesanoSchema.safeParse(datosIncompletos);

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar un email inválido", () => {
      const resultado = registroArtesanoSchema.safeParse({
        ...usuarioArtesanoValido,
        email: "email-invalido"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar un DNI demasiado corto", () => {
      const resultado = registroArtesanoSchema.safeParse({
        ...usuarioArtesanoValido,
        dni: "123"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar propiedades adicionales", () => {
      const resultado = registroArtesanoSchema.safeParse({
        ...usuarioArtesanoValido,
        datoExtra: "no permitido"
      });

      assert.equal(resultado.success, false);
    });
  });

  // REGISTRO DE ADMINISTRADOR
  describe("registrarAdminSchema", () => {

    it("Debe aceptar los datos válidos de un administrador", () => {
      const resultado = registrarAdminSchema.safeParse(usuarioValido);

      assert.equal(resultado.success, true);
    });

    it("Debe rechazar un registro con datos incompletos", () => {
      const { apellido, ...datosIncompletos } = usuarioValido;

      const resultado = registrarAdminSchema.safeParse(datosIncompletos);

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar propiedades adicionales", () => {
      const resultado = registrarAdminSchema.safeParse({
        ...usuarioValido,
        rol: "admin"
      });

      assert.equal(resultado.success, false);
    });
  });

  // ASIGNACIÓN DE ARTESANO
  describe("asignarArtesanoSchema", () => {

    it("Debe aceptar los datos válidos de un artesano con usuarioId", () => {
      const resultado = asignarArtesanoSchema.safeParse({
        ...artesanoValido,
        usuarioId: "550e8400-e29b-41d4-a716-446655440000"
      });

      assert.equal(resultado.success, true);
    });

    it("Debe rechazar un usuarioId inválido", () => {
      const resultado = asignarArtesanoSchema.safeParse({
        ...artesanoValido,
        usuarioId: "12345"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar la ausencia de usuarioId", () => {
      const resultado = asignarArtesanoSchema.safeParse(artesanoValido);

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar datos incompletos del artesano", () => {
      const { rubroId, ...datosIncompletos } = artesanoValido;

      const resultado = asignarArtesanoSchema.safeParse({
        ...datosIncompletos,
        usuarioId: "550e8400-e29b-41d4-a716-446655440000"
      });

      assert.equal(resultado.success, false);
    });

    it("Debe rechazar propiedades adicionales", () => {
      const resultado = asignarArtesanoSchema.safeParse({
        ...artesanoValido,
        usuarioId: "550e8400-e29b-41d4-a716-446655440000",
        datoExtra: "no permitido"
      });

      assert.equal(resultado.success, false);
    });
  });
});