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
} from "../controllers/usuarios.controller.js";
import { actualizarActivo } from "../controllers/estado.controller.js";
import { cerrarSesion } from "../controllers/sesiones.controller.js";
import {
  agregarRolAdmin,
  eliminarRol,
} from "../controllers/roles.controller.js";
import { asociarArtesano } from "../controllers/artesanos.controller.js";

const router = express.Router();

//rutas publicas
router.post(
  "/registro-artesano",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Registrar un nuevo artesano'
       #swagger.description = 'Registra un usuario con sus datos personales y los datos correspondientes a su perfil de artesano.'
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/NuevoUsuarioArtesano' }
               }
           }
       }
       #swagger.responses[201] = {
           description: 'Artesano registrado correctamente'
       }
       #swagger.responses[400] = {
           description: 'Datos de registro inválidos'
       }
       #swagger.responses[409] = {
           description: 'El email o DNI ya se encuentra registrado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  validarRegistroArtesano,
  generarUsuarioArtesano,
);

router.post("/login", 
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Iniciar sesión'
       #swagger.description = 'Autentica al usuario mediante su email y contraseña.'
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/InicioSesion' }
               }
           }
       }
       #swagger.responses[200] = {
           description: 'Inicio de sesión exitoso. Devuelve un token y los datos del usuario.'
       }
       #swagger.responses[400] = {
           description: 'Datos de inicio de sesión inválidos'
       }
       #swagger.responses[401] = {
           description: 'Credenciales incorrectas o usuario inactivo'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  validarInicioSesion, iniciarSesionUsuario);

//rutas solo autenticacion
router.get("/me", 
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Obtener el perfil del usuario autenticado'
       #swagger.description = 'Devuelve la información del usuario correspondiente al token de autenticación.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.responses[200] = {
           description: 'Perfil del usuario obtenido correctamente'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[404] = {
           description: 'Usuario no encontrado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario, cargarContextoUsuario, obtenerMiPerfil);
router.post("/logout", 
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Cerrar sesión'
       #swagger.description = 'Cierra la sesión del usuario autenticado.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.responses[200] = {
           description: 'Sesión cerrada correctamente'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario, cerrarSesion);

//rutas protegidas
router.post(
  "/registro-administrador",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Registrar un administrador'
       #swagger.description = 'Permite a un administrador autenticado registrar un nuevo usuario con el rol ADMINISTRADOR.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/NuevoAdministrador' }
               }
           }
       }
       #swagger.responses[201] = {
           description: 'Administrador registrado correctamente'
       }
       #swagger.responses[400] = {
           description: 'Datos de registro inválidos'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[403] = {
           description: 'El usuario no tiene permisos de administrador'
       }
       #swagger.responses[409] = {
           description: 'El email ya se encuentra registrado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarRegistroAdmin,
  crearAdministrador,
);

router.post(
  "/asignar-rolArtersano",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Asociar un usuario con un artesano'
       #swagger.description = 'Permite a un administrador asociar los datos de artesano a un usuario.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/AsignacionArtesano' }
               }
           }
       }
       #swagger.responses[200] = {
           description: 'Artesano asociado correctamente'
       }
       #swagger.responses[400] = {
           description: 'Datos de asociación inválidos'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[403] = {
           description: 'El usuario no tiene permisos de administrador o la cuenta está inactiva'
       }
       #swagger.responses[404] = {
           description: 'Usuario, rubro o ubicación no encontrado'
       }
       #swagger.responses[409] = {
           description: 'El usuario ya tiene un perfil de artesano o existe un dato duplicado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarAsignacionArtesano,
  asociarArtesano,
);

router.post(
  "/:id/roles",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Asignar el rol de administrador'
       #swagger.description = 'Permite a un administrador asignar el rol ADMINISTRADOR a un usuario.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.parameters['id'] = {
           in: 'path',
           description: 'Identificador UUID del usuario',
           required: true,
           type: 'string',
           format: 'uuid'
       }
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/AsignarAdministrador' }
               }
           }
       }
       #swagger.responses[200] = {
           description: 'Rol asignado correctamente'
       }
       #swagger.responses[400] = {
           description: 'ID o datos de rol inválidos'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[403] = {
           description: 'El usuario no tiene permisos de administrador o la cuenta está inactiva'
       }
       #swagger.responses[404] = {
           description: 'Usuario no encontrado'
       }
       #swagger.responses[409] = {
           description: 'El usuario ya tiene ese rol'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarUuid,
  asignarAdmin,
  agregarRolAdmin,
);
router.delete(
  "/:id/roles/:rol",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Eliminar un rol de un usuario'
       #swagger.description = 'Permite a un administrador retirar el rol ARTESANO o ADMINISTRADOR de un usuario.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.parameters['id'] = {
           in: 'path',
           description: 'Identificador UUID del usuario',
           required: true,
           type: 'string',
           format: 'uuid'
       }
       #swagger.parameters['rol'] = {
           in: 'path',
           description: 'Rol que se desea retirar',
           required: true,
           type: 'string',
           enum: ['ARTESANO', 'ADMINISTRADOR']
       }
       #swagger.responses[200] = {
           description: 'Rol eliminado correctamente'
       }
       #swagger.responses[400] = {
           description: 'ID o rol inválido'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[403] = {
           description: 'El usuario no tiene permisos de administrador o la cuenta está inactiva'
       }
       #swagger.responses[404] = {
           description: 'Usuario o rol no encontrado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarUuid,
  quitarRol,
  eliminarRol,
);
router.patch(
  "/:id/activo",
  /* #swagger.tags = ['Usuarios']
       #swagger.summary = 'Actualizar el estado de un usuario'
       #swagger.description = 'Permite a un administrador activar o desactivar un usuario.'
       #swagger.security = [{ bearerAuth: [] }]
       #swagger.parameters['id'] = {
           in: 'path',
           description: 'Identificador UUID del usuario',
           required: true,
           type: 'string',
           format: 'uuid'
       }
       #swagger.requestBody = {
           required: true,
           content: {
               'application/json': {
                   schema: { $ref: '#/components/schemas/ActualizarActivo' }
               }
           }
       }
       #swagger.responses[200] = {
           description: 'Estado del usuario actualizado correctamente'
       }
       #swagger.responses[400] = {
           description: 'ID o estado inválido'
       }
       #swagger.responses[401] = {
           description: 'Token ausente, inválido o expirado'
       }
       #swagger.responses[403] = {
           description: 'El usuario no tiene permisos de administrador o la cuenta está inactiva'
       }
       #swagger.responses[404] = {
           description: 'Usuario no encontrado'
       }
       #swagger.responses[500] = {
           description: 'Error interno del servidor'
       }
    */
  autenticarUsuario,
  cargarContextoUsuario,
  autorizarRoles("ADMINISTRADOR"),
  validarUuid,
  validarActualizacionEstado,
  actualizarActivo,
);

export default router;
