export const validarConsultaArtesanos = (req, res, next) => {
    const { pagina, limite, ordenPor, direccion } = req.query;

    const validacion = {
        ...req.query,
        pagina: Number(pagina) || 1,
        limite: Number(limite) || 2,
        ordenPor: ordenPor || 'id',
        direccion: direccion || 'asc'
    };
    

    console.log("Query después de validar:", validacion);

    req.consultaValidada = validacion;
    return next();
}