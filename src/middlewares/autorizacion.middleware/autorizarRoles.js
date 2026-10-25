export const autorizarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        const usuario = req.contextoUsuario;
        const permitido = (usuario?.rol ?? []).some((rol) => rolesPermitidos.includes(rol),);
    if (!permitido){
        return res.status(403).json({
            mensaje: "No tiene permiso para esta operaciónes.",
        });
    }
    return next();
    };
};