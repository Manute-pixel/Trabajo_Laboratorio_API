export const validarArtesano = (req, res, next) => {
    const { nombre, apellido, dni, email, fechaNac, rubro, localidad, provincia } = req.body;

    if (!nombre || !apellido || !dni || !email || !fechaNac || !rubro || !localidad || !provincia) {
        return res.status(400).json({ mensaje: "Todos los campos de un artesano son obligatorios" });
    }

    req.datosValidados = { nombre, apellido, dni, email, fechaNac, rubro, localidad, provincia };
    return next();
}