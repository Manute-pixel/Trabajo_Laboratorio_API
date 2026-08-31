import { artesanos } from '../data/artesanos.js';
export const obtenerArtesanos = (req, res) => {
    res.json(artesanos);
};
