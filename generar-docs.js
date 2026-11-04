import swaggerAutogen from "swagger-autogen";

import {
  NuevoArtesano,
  ConsultaArtesanos,
  Artesano,
} from "./src/documentacion/esquemas_artesanos.js";

import {
  MiProducto,
  ConsultaProductos,
  Producto,
} from "./src/documentacion/esquemas_productos.js";

import {
  NuevoStand,
  ConsultaStands,
  Stand,
  ActualizarStand,
} from "./src/documentacion/esquemas_stands.js";

const generarDocs = swaggerAutogen({
  openapi: "3.0.0",
});

const doc = {
  info: {
    title: "Poncho Digital API",
    description: "Documentación de la API Poncho Digital",
    version: "1.0.0",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],

  tags: [
    {
      name: "Artesanos",
      description: "Endpoints para gestionar artesanos",
    },
    {
      name: "Productos",
      description: "Endpoints para gestionar productos",
    },
    {
      name: "Stands",
      description: "Endpoints para gestionar stands",
    }
  ],

  components: {
    schemas: {
      NuevoArtesano,
      ConsultaArtesanos,
      Artesano,
      MiProducto,
      ConsultaProductos,
      Producto,
      NuevoStand,
      ConsultaStands,
      Stand,
      ActualizarStand,
    },

    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./swagger-output.json";

// Archivo principal donde se montan las rutas
const endpointsFiles = ["./src/app.js"];

generarDocs(outputFile, endpointsFiles, doc);