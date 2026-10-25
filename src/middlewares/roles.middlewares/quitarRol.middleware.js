import { retirarRolParametrosSchema } from "../../validators/roles.schema.js";

export const quitarRol = (req, res, next) => {
    const resultado = retirarRolParametrosSchema.safeParse(req.params);

    if (!resultado.success) {
        const detalles = detallarErroresZod(resultado.error);
        return next(crearError('parametros invalidos para retirar el rol', 400, detalles));
    }

    req.dto = resultado.data;
    return next();
}