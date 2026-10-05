import prisma from '../config/prisma.js';
import { crearError } from '../utils/errores.js';

export const verificarSector = async (sectorId) => {

    if (sectorId == undefined || sectorId == null) {
        return;
    }
    const sector = await prisma.sector.findUnique({where: {id: sectorId}});
    if (!sector) {
        throw crearError("Sector no encontrado", 404);
    }
};

export const verificarArtesano = async (artesanoId) => {
    if (artesanoId == undefined || artesanoId == null) {
        return;
    }
    const artesano = await prisma.artesano.findUnique({where: {id: artesanoId}});
    if (!artesano) {
        throw crearError("Artesano no encontrado", 404);
    }
};

export const consultarStands = async (criterios) => {
    const {
        numero,
        estado,
        sectorId,
        artesanoId,
        ordenPor,
        direccion,
        pagina,
        limite
    } = criterios;
    const where = {};
    if (numero!== undefined) {
        where.numero = { 
            contains: numero
        };
    }
    if (estado!== undefined) {
        where.estado = { 
            contains: estado,
            mode: 'insensitive'
        };
    }
    if (sectorId!== undefined) {
        where.sectorId = sectorId;
    }
    if (artesanoId!== undefined) {
        where.artesanoId = artesanoId;
    }
    const desplazamiento = (pagina - 1) * limite;
    const campoOrden = {numero: 'numero_stand', estado: 'estado_stand', sector: 'sectorId', artesano: 'artesanoId'};
    const [stands, total ] = await prisma.$transaction([
        prisma.stand.findMany({
            where,
            orderBy: [
                {[campoOrden[ordenPor]]: direccion}, {id: 'asc'}
            ],
            skip: desplazamiento,
            take: limite,
            include: {
                sector: true,
                artesano: true
            }
        }),
        prisma.stand.count({ where })
    ]);
    return { stands, paginacion: { 
        pagina, 
        limite, 
        total, 
        totalPaginas: Math.ceil(total / limite) } 
    };
};

export const consultarStandPorId = async (id) => {
    return prisma.stand.findUnique({
        where: { id: id},
        include: {
            sector: true,
            artesano: true
        }
    })
};

export const crearStand = async (standData) => {
    const { numero, estado, sectorId } = standData;
    await verificarSector(sectorId);
    return prisma.stand.create({
        data: { numero_stand: numero, estado_stand: estado, sectorId}, include: { sector: true } });
};


export const actualizarStand = async (id, standData) => {
    const standExistente = await prisma.stand.findUnique({ where: { id} });
    if (!standExistente) {
        return null;
    }
    const { numero, estado, sectorId, artesanoId } = standData;
    await verificarSector(sectorId);
    await verificarArtesano(artesanoId);
    return prisma.stand.update({
        where: { id },
        data: { numero_stand: numero, estado_stand: estado, sectorId, artesanoId: artesanoId ?? null}, include: { sector: true, artesano: true }
    });
};
    
export const eliminarStand = async (id) => {
   const standExistente = await prisma.stand.findUnique({ where: { id } });
   if (!standExistente) {
       return null;
   }
   return prisma.stand.delete({ where: { id } });
};