import { crearError } from "../../utils/errores.js";

export const validarPostulacion = (req, res, next) => {
    const { artesanoId, edicionId } = req.body;

    if (!artesanoId || !edicionId) {
        return next(crearError("los campos artesanoId y edicionId son obligatorios", 400));
    }

    req.postulacionValidada = { artesanoId, edicionId };
    next();
}