import { crearError } from "../../utils/errores.js";

export const validarActualizacionPostulacion = (req, res, next) => {
    const { artesanoId, edicionId, estado } = req.body;

    if (!artesanoId || !edicionId || !estado) {
        return next(crearError("los campos artesanoId, edicionId y estado son obligatorios al actualizar la postulacion", 400));
    }

    if (estado !== "Pendiente" && estado !== "Aceptada" && estado !== "Rechazada" && estado !== "Corregir") {
        return next(crearError("el campo estado debe ser 'Pendiente', 'Aceptada', 'Rechazada' o 'Corregir'", 400));
    }

    if (estado === "Pendiente") return next(crearError("debe cambiar el estado al actualizar la postulacion", 400));

    req.actualizacionValidada = { artesanoId, edicionId, estado };
    next();
}