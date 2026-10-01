export const validarConsultaPostulacion = (req, res, next) => {
    const { artesanoId, edicionId, estado, ordenPor, direccion, pagina, limite } = req.query;

    const validacion = {
        ...req.query,
        pagina: Number(pagina) || 1,
        limite: Number(limite) || 2,
        ordenPor: ordenPor || 'artesanoId',
        direccion: direccion || 'asc'
    };

    req.consultaValidada = validacion;
    return next();
};