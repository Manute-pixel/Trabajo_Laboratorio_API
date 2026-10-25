import { asignarAdministradorSchema } from "../../validators/roles.schema.js";

export const asignarAdmin = (req, res, next) => {
    const resultado = asignarAdministradorSchema.safeParse(req.body);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('solo se puede asignar ADMINISTRADOR', 400, detalles));
    }

    req.dto = resultado.data;
    return next();
}