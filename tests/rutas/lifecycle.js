import { after, afterEach, before, beforeEach } from "node:test";
import request from "supertest";

let appCompartida;
let prismaCompartido;
let contextoCompartido;
let tokensCompartidos;
let suitesPendientes = 0;

export const configurarPruebasRutas = () => {
  let app;
  let crearPeticionActual;
  suitesPendientes += 1;

  before(async () => {
    if (!contextoCompartido) {
      const [
        moduloApp,
        moduloPrisma,
        moduloEscenario,
        moduloTokens,
      ] = await Promise.all([
        import("../../src/app.js"),
        import("../../src/config/prisma.js"),
        import("../integracion/escenarioIntegracion.js"),
        import("../../src/services/tokens.service.js"),
      ]);

      appCompartida = moduloApp.app;
      prismaCompartido = moduloPrisma.default;
      contextoCompartido =
        await moduloEscenario.crearContextoIntegracion(prismaCompartido);
      tokensCompartidos = {
        administrador: moduloTokens.generarToken(
          contextoCompartido.usuarioAdmin,
        ),
        artesano: moduloTokens.generarToken(
          contextoCompartido.usuarioArtesano,
        ),
      };
    }

    app = appCompartida;
  });

  beforeEach(() => {
    crearPeticionActual = (metodo, ruta) => request(app)[metodo](ruta);
  });

  afterEach(() => {
    crearPeticionActual = undefined;
  });

  after(async () => {
    suitesPendientes -= 1;
    if (suitesPendientes === 0) {
      if (contextoCompartido) await contextoCompartido.limpiar();
      if (prismaCompartido) await prismaCompartido.$disconnect();
      appCompartida = undefined;
      prismaCompartido = undefined;
      contextoCompartido = undefined;
      tokensCompartidos = undefined;
    }
  });

  return (metodo, ruta) => {
    if (!crearPeticionActual) {
      throw new Error("El contexto de la prueba de rutas no está inicializado.");
    }

    return crearPeticionActual(metodo, ruta);
  };
};

export const obtenerTokensPrueba = () => {
  if (!tokensCompartidos) {
    throw new Error("Los tokens de prueba no están inicializados.");
  }

  return tokensCompartidos;
};
