import { artesanos } from '../data/artesanos.js';
export const agregarArtesano = (req, res) => {
    const {nombre, dni, rubro, localidad } = req.body;
    
    const nuevoArtesano = {
        id: artesanos.length > 0 ? Math.max(...artesanos.map(a => a.id)) + 1 : 1,
        nombre,
        dni,
        rubro,
        localidad,
    };
    if (artesanos.some(artesano => artesano.nombre === nombre && artesano.dni === dni)) {
        return res.status(400).json({ mensaje: 'Esta persona ya está registrada' });
    }
    

    if (!nombre || !dni || !rubro || !localidad) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    artesanos.push(nuevoArtesano);
    res.status(201).json({
        mensaje: 'Artesano agregado exitosamente',
        artesano: nuevoArtesano
    });
    
}
