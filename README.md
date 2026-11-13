# Poncho Digital API

API REST desarrollada para el proyecto **Poncho Digital**, una plataforma digital destinada a brindar información y gestionar los datos relacionados con los artesanos, productos y stands de la Fiesta Nacional e Internacional del Poncho.

## Integrantes

* Acevedo, Jose Manuel MU: 00447
* Rodriguez, Fabrizio Gabriel MU: 00376
* Toloza, Guadalupe del Valle MU:00459

## Requisitos

* Node.js 24.x LTS
* npm
* PostgreSQL

## Instalacion

Clonar el repositorio, instalar las dependencias y crear el archivo de entorno local a partir del ejemplo:

```bash
npm ci
cp .env.example .env
```

En Windows PowerShell, el archivo de entorno también se puede crear con:

```powershell
Copy-Item .env.example .env
```

Configurar en `.env` las variables necesarias:

| Variable | Descripción |
| -------- | ----------- |
| `DATABASE_URL` | URL de conexión a PostgreSQL, por ejemplo `postgresql://usuario:contraseña@localhost:5432/poncho_digital?schema=public`. |
| `JWT_SECRET` | Secreto utilizado para firmar los tokens JWT. Se puede generar con `npm run jwt-secret`. |
| `ADMIN_NOMBRE` | Nombre del administrador inicial; requerido para `npm run init-admin`. |
| `ADMIN_APELLIDO` | Apellido del administrador inicial; requerido para `npm run init-admin`. |
| `ADMIN_EMAIL` | Correo del administrador inicial; requerido para `npm run init-admin`. |
| `ADMIN_PASSWORD` | Contraseña del administrador inicial, de al menos 8 caracteres; requerido para `npm run init-admin`. |

Las variables `ADMIN_*` solo son necesarias al crear el primer administrador.

## Base de datos

Con PostgreSQL iniciado y `DATABASE_URL` configurada, generar el cliente Prisma y aplicar las migraciones existentes:

```bash
npx prisma generate
npx prisma migrate deploy
```

Para desarrollo, cuando se modifique el esquema y se quiera crear una migración nueva:

```bash
npx prisma migrate dev --name nombre_de_la_migracion
```

Las migraciones crean las tablas y los roles iniciales `ARTESANO` y `ADMINISTRADOR`. El proyecto no tiene configurado un seed independiente de Prisma, por lo que `npx prisma db seed` no está disponible. El script de inicialización de la aplicación crea el primer administrador y cumple ese propósito de carga inicial. Completar las variables `ADMIN_*` en `.env` y ejecutar después de aplicar las migraciones:

```bash
npm run init-admin
```

## Ejecucion

Para iniciar el servidor en modo desarrollo, ejecutar:

```bash
npm run dev
```

Para iniciar el servidor sin modo de observación:

```bash
npm start
```

El servidor se inicia en `http://localhost:3000`.

Para ejecutar las pruebas de rutas:

```bash
npm run test:rutas
```

## Endpoints

La documentación interactiva de la API está disponible con Swagger en:

* [http://localhost:3000/docs](http://localhost:3000/docs)

El archivo de especificación OpenAPI generado se encuentra en `swagger-output.json`. Para regenerarlo:

```bash
npm run docs
```

| Metodo | Ruta | Descripcion |
| ------ | ---- | ----------- |
| POST | `/usuarios/registro-artesano` | Registra un usuario y su perfil de artesano. |
| POST | `/usuarios/login` | Inicia sesión y devuelve un token de autenticación. |
| GET | `/usuarios/me` | Obtiene el perfil del usuario autenticado. |
| POST | `/usuarios/logout` | Cierra la sesión e invalida el token actual. |
| POST | `/usuarios/registro-administrador` | Registra un administrador. Requiere permisos de administrador. |
| POST | `/usuarios/asignar-rolArtersano` | Asocia un usuario existente con un perfil de artesano. Requiere permisos de administrador. |
| POST | `/usuarios/:id/roles` | Asigna el rol de administrador a un usuario. |
| DELETE | `/usuarios/:id/roles/:rol` | Elimina un rol de un usuario. |
| PATCH | `/usuarios/:id/activo` | Activa o desactiva un usuario. |
| GET | `/artesanos` | Lista y filtra artesanos con paginación y ordenamiento. |
| GET | `/artesanos/:id` | Obtiene un artesano por su ID. |
| GET | `/artesanos/me` | Obtiene el perfil de artesano asociado al usuario autenticado. |
| PATCH | `/artesanos/:id` | Actualiza los datos de un artesano. Requiere permisos de administrador. |
| DELETE | `/artesanos/:id` | Elimina un artesano. Requiere permisos de administrador. |
| GET | `/productos` | Lista y filtra productos con paginación y ordenamiento. |
| GET | `/productos/:id` | Obtiene un producto por su ID. |
| POST | `/productos` | Registra un producto y lo asigna a un artesano. Requiere permisos de administrador. |
| PUT | `/productos/:id` | Actualiza un producto. Requiere permisos de administrador. |
| DELETE | `/productos/:id` | Elimina un producto. Requiere permisos de administrador. |
| GET | `/productos/mis-productos` | Lista los productos del artesano autenticado. |
| GET | `/productos/mis-productos/:id` | Obtiene un producto propio por su ID. |
| POST | `/productos/crear-mi-producto` | Registra un producto para el artesano autenticado. |
| PUT | `/productos/actualizar-mi-producto/:id` | Actualiza un producto propio. |
| DELETE | `/productos/eliminar-mi-producto/:id` | Elimina un producto propio. |
| GET | `/stands` | Lista y filtra stands con paginación y ordenamiento. |
| GET | `/stands/:id` | Obtiene un stand por su ID. |
| POST | `/stands` | Crea un stand. Requiere permisos de administrador. |
| PUT | `/stands/:id` | Actualiza un stand. Requiere permisos de administrador. |
| DELETE | `/stands/:id` | Elimina un stand. Requiere permisos de administrador. |
| PATCH | `/stands/asignar-stand-artesano/:id` | Asigna un artesano a un stand. Requiere permisos de administrador. |
| PATCH | `/stands/desvincular-stand-artesano/:id` | Desvincula el artesano de un stand. Requiere permisos de administrador. |
| GET | `/postulaciones` | Lista y filtra postulaciones. Requiere permisos de administrador. |
| GET | `/postulaciones/:id` | Obtiene una postulación por su ID. Requiere permisos de administrador. |
| POST | `/postulaciones` | Crea una postulación. Requiere permisos de administrador. |
| PATCH | `/postulaciones/:id` | Actualiza una postulación. Requiere permisos de administrador. |
| GET | `/postulaciones/mi-postulacion` | Obtiene la postulación del artesano autenticado. |
| POST | `/postulaciones/postularme` | Registra una postulación para el artesano autenticado. |
| PATCH | `/postulaciones/actualizar-mi-postulacion` | Actualiza la postulación del artesano autenticado. |
| GET | `/reportes/artesano` | Obtiene la cantidad total de artesanos. Requiere permisos de administrador. |
| GET | `/reportes/artesano-localidad` | Obtiene el total de artesanos agrupados por localidad. Requiere permisos de administrador. |
| GET | `/reportes/artesano-rubro` | Obtiene el total de artesanos agrupados por rubro. Requiere permisos de administrador. |
| GET | `/reportes/producto-artesano` | Obtiene el total de productos por artesano. Requiere permisos de administrador. |
| GET | `/reportes/stands` | Obtiene el resumen de stands ocupados y disponibles. Requiere permisos de administrador. |

## Tecnologias

* Node.js 24.x LTS
* Express 5.x
* JavaScript (ESM)
* PostgreSQL y Prisma ORM
* Swagger / OpenAPI

## Estado del proyecto

Proyecto en desarrollo correspondiente al **Trabajo de Laboratorio de la cátedra Desarrollo Backend**, de la **Tecnicatura Universitaria en Diseño de Software U.N.Ca.**
