export const logger = (req, res, next) => {
    const inicio = Date.now();

    res.on('finish', () =>{
        const ms = Date.now() - inicio;
        console.log (`Método: ${req.method} - Ruta: ${req.originalUrl} - Tiempo: ${ms} ms`);
    });

    next();
}