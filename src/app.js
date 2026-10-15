import express from 'express';
import {logger} from './middlewares/logger.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { noEncontrado } from './middlewares/noEncontrado.js';
import artesanosRoutes from './routes/artesanos.routes.js';
import postulacionesRoutes from './routes/postulaciones.routes.js';
import standsRoutes from './routes/stands.routes.js';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

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
app.use(manejadorErrores);


app.listen(PORT, () => {
console.log (`Servidor iniciado en el puerto ${PORT}`)
});