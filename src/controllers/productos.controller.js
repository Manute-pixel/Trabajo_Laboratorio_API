import * as productoService from '../services/productos.service.js';

export const obtenerProductos = async(req, res, next) => {
    try{
        const criterios = req.consultaValidada;
        const productos = await productoService.consultarProductos(criterios);

        res.status(200).json(productos);
    } catch (error) {
        next(error);
    } 
};

export const obtenerProductoPorId = async (req, res, next) => {
   try {
    const id = req.id;
    const producto = await productoService.consultarProductoPorId(id);

    res.status(200).json(producto);
   } catch (error) {
    next(error);
   }
};

export const agregarProducto = async (req, res, next) => {
    try {
        const nuevoProducto = req.body;
        const resultado = await productoService.agregarProducto(nuevoProducto);

        res.status(201).json(resultado);
    }catch(error){
        next(error);
    }
}

export const actualizarProducto = async (req, res, next) => {
    try {
        const id= req.id;
        const datos = req.body;
        const productoActualizado = await productoService.actualizarProducto(id, datos);

        res.status(200).json(productoActualizado);
    } catch (error) {
        next(error);
    }
}

export const eliminarProducto = async (req, res, next) => {
    try {
        const id = req.id;
        const productoEliminado = await productoService.eliminarProducto(id);

        res.status(204).send(`Producto con ID ${id} eliminado exitosamente`);
    }catch (error) {
        next(error);
    }
}