
// Total de artesanos
export const TotalArtesanos = {
    type: "object",
    properties: {
        totalArtesanos: {
            type: "integer",
            example: 150
        }
    }
};

// Cantidad de artesanos por localidad
export const ArtesanosPorLocalidad = {
    type: "array",
    items: {
        type: "object",
        properties: {
            localidad: {
                type: "string",
                example: "San Fernando del Valle de Catamarca"
            },
            totalArtesanos: {
                type: "integer",
                example: 25
            }
        }
    }
};

// Cantidad de artesanos por rubro
export const ArtesanosPorRubro = {
    type: "array",
    items: {
        type: "object",
        properties: {
            rubro: {
                type: "string",
                example: "Textil"
            },
            totalArtesanos: {
                type: "integer",
                example: 40
            }
        }
    }
};

// Cantidad de productos por artesano
export const ProductosPorArtesano = {
    type: "array",
    items: {
        type: "object",
        properties: {
            artesano: {
                type: "string",
                example: "María Gómez"
            },
            dni: {
                type: "string",
                example: "30123456"
            },
            telefono: {
                type: "string",
                example: "3834123456"
            },
            email: {
                type: "string",
                format: "email",
                example: "maria@gmail.com"
            },
            totalProductos: {
                type: "integer",
                example: 8
            }
        }
    }
};


// Reporte de stands
export const ReporteStands = {
    type: "object",
    properties: {
        totalStands: {
            type: "integer",
            example: 100
        },
        ocupados: {
            type: "integer",
            example: 70
        },
        disponibles: {
            type: "integer",
            example: 30
        }
    }
};