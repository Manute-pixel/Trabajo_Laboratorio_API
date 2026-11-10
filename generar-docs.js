import swaggerAutogen from "swagger-autogen";

import {
  NuevoArtesano,
  ConsultaArtesanos,
  Artesano,
} from "./src/documentacion/esquemas_artesanos.js";

import {
  MiProducto,
  NuevoProducto,
  ConsultaProductos,
  Producto,
  ActualizarProducto,
  MiProductoRespuesta
} from "./src/documentacion/esquemas_productos.js";

import {
  NuevoUsuarioArtesano,
  NuevoAdministrador,
  InicioSesion,
  AsignacionArtesano,
  AsignarAdministrador,
  RetirarRolParametros,
  ActualizarActivo,
} from "./src/documentacion/esquemas_usuarios.js";

import {
  NuevoStand,
  ConsultaStands,
  Stand,
  ActualizarStand,
  AsignarStand,
} from "./src/documentacion/esquemas_stands.js";

import {
  ConsultarPostulaciones,
  Postulacion,
  NuevaPostulacion,
  ActualizarPostulacionAdmin,
  ActualizarMiPostulacion,
  MiPostulacion,
  CrearMiPostulacion
} from "./src/documentacion/esquemas_postulaciones.js";

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
    },
    {
      name: "Usuarios",
      description: "Endpoints para gestionar usuarios",
    },
    {
      name: "Postulaciones",
      description: "Endpoints para gestionar postulaciones",
    }
  ],

  components: {
    schemas: {
      NuevoArtesano,
      ConsultaArtesanos,
      Artesano,
      MiProducto,
      NuevoProducto,
      ConsultaProductos,
      Producto,
      ActualizarProducto,
      MiProductoRespuesta,
      NuevoStand,
      ConsultaStands,
      Stand,
      AsignarStand,
      ActualizarStand,
      NuevoUsuarioArtesano,
      NuevoAdministrador,
      InicioSesion,
      AsignacionArtesano,
      AsignarAdministrador,
      RetirarRolParametros,
      ActualizarActivo,
      ConsultarPostulaciones,
      Postulacion,
      NuevaPostulacion,
      ActualizarPostulacionAdmin,
      ActualizarMiPostulacion,
      MiPostulacion,
      CrearMiPostulacion
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