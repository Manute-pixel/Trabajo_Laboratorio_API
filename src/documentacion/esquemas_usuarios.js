import z from "zod";
import {
    registroArtesanoSchema,
    registrarAdminSchema,
    inicioSesionSchema,
    asignarArtesanoSchema
} from "../validators/usuarios.schema.js";
import {
    asignarAdministradorSchema,
    retirarRolParametrosSchema
} from "../validators/roles.schema.js";
import { actualizarActivoSchema } from "../validators/estado.schema.js";

export const NuevoUsuarioArtesano = {
    ...z.toJSONSchema(registroArtesanoSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@example.com",
        password: "contraseña123",
        dni: "30123456",
        fechaNac: "1995-06-15",
        telefono: "3834123456",
        rubroId: 1,
        localidadId: 1,
        provinciaId: 1
    }
};

export const NuevoAdministrador = {
    ...z.toJSONSchema(registrarAdminSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@example.com",
        password: "contraseña123"
    }
};

export const InicioSesion = {
    ...z.toJSONSchema(inicioSesionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        email: "juan.perez@example.com",
        password: "contraseña123"
    }
};

export const AsignacionArtesano = {
    ...z.toJSONSchema(asignarArtesanoSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        usuarioId: "550e8400-e29b-41d4-a716-446655440000",
        nombre: "Juan",
        apellido: "Pérez",
        dni: "30123456",
        email: "juan.perez@example.com",
        fechaNac: "1995-06-15",
        telefono: "3834123456",
        rubroId: 1,
        localidadId: 1,
        provinciaId: 1
    }
};

export const AsignarAdministrador = {
    ...z.toJSONSchema(asignarAdministradorSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        rol: "ADMINISTRADOR"
    }
};

export const RetirarRolParametros = {
    ...z.toJSONSchema(retirarRolParametrosSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        rol: "ARTESANO"
    }
};

export const ActualizarActivo = {
    ...z.toJSONSchema(actualizarActivoSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        activo: false
    }
};
