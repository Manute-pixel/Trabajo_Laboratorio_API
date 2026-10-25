import express from 'express';
import {logger} from './middlewares/logger.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { noEncontrado } from './middlewares/noEncontrado.js';
import artesanosRoutes from './routes/artesanos.routes.js';
import postulacionesRoutes from './routes/postulaciones.routes.js';
import standsRoutes from './routes/stands.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import "./config/jwt.js";
import { iniciarLimpiezaRevocaciones } from './tareas/limpiezaRevocaciones.js';

const app = express();
const PORT = 3000;

app.use(logger);
app.use(express.json());
app.use('/stands', standsRoutes);
app.use('/productos', productosRoutes);
app.use('/postulaciones', postulacionesRoutes);
app.use('/artesanos', artesanosRoutes);
app.use('/usuarios', usuariosRoutes);


//Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('Bienvenido a Poncho Digital API');
});


//Ruta de información
app.get('/info', (req, res) => {
    res.json ({
        mensaje: `Poncho Digital API`,
        version: `1.0.0`,
        estado: `En desarrollo`
    })
});


//Manejo de rutas no encontradas
app.use(noEncontrado);
//Manejo de errores

app.use((err, req, res, next) => {
    if(res.headersSent) return next(err);
    const mensajes ={
        P2002: "Ya existe un registro con esos datos unicos.",
        P2003: "La operación afecta a registros relacionados.",
        P2025: "Registro no encontrado.",
        P2034: "Hubo otro cambio simultáneo. Reintentar."
    };
    const mensajeErrorPrisma = mensajes [err.code];
    const estado = mensajeErrorPrisma ? (err.code === "P2025" ? 404 : 409) : (err.status || 500);
    const mensaje = estado >= 500 ? "Error interno del servidor." : (mensajeErrorPrisma || err.message);
    return res.status(estado).json({mensaje});
});

app.listen(PORT, () => {
    console.log (`Servidor iniciado en el puerto ${PORT}`);
    iniciarLimpiezaRevocaciones();
});