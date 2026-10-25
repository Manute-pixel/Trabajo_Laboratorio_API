import express from "express";
// middlewares:
import { validarUuid } from "../middlewares/usuarios.middlewares/validarUuid.js";
import { validarActualizacionEstado } from "../middlewares/estado.middlewares/validarActualizacionEstado.js";
import { asignarAdmin } from "../middlewares/roles.middlewares/asignarAdmin.middleware.js";
import { quitarRol } from "../middlewares/roles.middlewares/quitarRol.middleware.js";
import { validarAsignacionArtesano } from "../middlewares/usuarios.middlewares/validarAsignacionArtesano.js";
import {
  validarRegistroArtesano,
  validarRegistroAdmin,
} from "../middlewares/usuarios.middlewares/validarRegistroUsuarios.js";
import { validarInicioSesion } from "../middlewares/validarInicioSesion.js";
import { cargarContextoUsuario } from "../middlewares/autorizacion.middleware/cargarContextoUsuario.js";
import { autorizarRoles } from "../middlewares/autorizacion.middleware/autorizarRoles.js";
import { autenticarUsuario } from "../middlewares/autenticacion.middleware.js";

//controllers:
import {
  generarUsuarioArtesano,
  iniciarSesionUsuario,
  obtenerMiPerfil,
  crearAdministrador,
  asociarRolArtesano,
} from "../controllers/usuarios.controller.js";
import { actualizarActivo } from "../controllers/estado.controller.js";
import { cerrarSesion } from "../controllers/sesiones.controller.js";
import {
  agregarRolAdmin,
  eliminarRol,
} from "../controllers/roles.controller.js";

const router = express.Router();

//rutas publicas
router.post(
  "/registro-artesano",
  validarRegistroArtesano,
  generarUsuarioArtesano,
);
router.post("/login", validarInicioSesion, iniciarSesionUsuario);

//rutas solo autenticacion
router.get(
  "/me",
  autenticarUsuario,
  cargarContextoUsuario,
  obtenerMiPerfil,
);
router.post("/logout", autenticarUsuario, cerrarSesion);

//rutas protegidas
router.post(
  "/registro-administrador",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarRegistroAdmin,
  crearAdministrador,
);
router.post(
  "/asignar-rolArtersano",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarAsignacionArtesano,
  asociarRolArtesano,
);
router.post(
  "/:id/roles",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarUuid,
  asignarAdmin,
  asignarAdmin,
  agregarRolAdmin,
);
router.delete(
  "/:id/roles/:rol",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  quitarRol,
  eliminarRol,
);
router.patch(
  "/:id/activo",
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarUuid,
  validarActualizacionEstado,
  actualizarActivo,
);

export default router;
