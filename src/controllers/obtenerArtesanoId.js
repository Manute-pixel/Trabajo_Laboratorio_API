import { artesanos } from '../data/artesanos.js';
export const obtenerArtesanoPorId = (req, res) => {
    const { id } = req.params;
    const artesano = artesanos.find(artesano => artesano.id === id);
    if (!artesano) {
        return res.status(404).json({ mensaje: 'Artesano no encontrado' });
    }
    res.json(artesano);
}   