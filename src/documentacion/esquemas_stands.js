import z from "zod";
import {
    standConsultaSchema,
    standCreacionSchema,
    standActualizacionSchema,
    standAsignacionSchema
} from "../validators/stand.schema.js";

const standConsultaSinFechas = standConsultaSchema.omit({
    fecha: true,
    fechaDesde: true,
    fechaHasta: true,
});

const consultaStandsJSON = z.toJSONSchema(standConsultaSinFechas, {
    target: "openapi-3.0",
    io: "input"
});

export const ConsultaStands = {
    ...consultaStandsJSON,
    properties: {
        ...consultaStandsJSON.properties,
        fecha: {
            type: "string",
            format: "date",
            example: "2026-11-09"
        },
        fechaDesde: {
            type: "string",
            format: "date",
            example: "2026-11-01"
        },
        fechaHasta: {
            type: "string",
            format: "date",
            example: "2026-11-30"
        }
    }
};

export const Stand = {
    type: "object",
    properties: {
        id: {
            type: "integer",
            example: 1
        },
        numero_stand: {
            type: "integer",
            example: 1
        },
        estado_stand: {
            type: "string",
            example: "DISPONIBLE"
        },
        createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-11-09T12:00:00.000Z"
        },
        artesano: {
            type: "object",
            nullable: true,
            properties: {
                id: {
                    type: "integer",
                    example: 1
                },
                nombre_artesano: {
                    type: "string",
                    example: "Juan"
                }
            }
        },
        sector: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    example: 1
                },
                nombre_sector: {
                    type: "string",
                    example: "Sector A"
                },
                pabellon: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1
                        },
                        nombre_pabellon: {
                            type: "string",
                            example: "Pabellón Norte"
                        },
                        edicion: {
                            type: "object",
                            properties: {
                                id: {
                                    type: "integer",
                                    example: 1
                                },
                                nombre_edicion: {
                                    type: "string",
                                    example: "Edición 2026"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const NuevoStand = {
    ...z.toJSONSchema(standCreacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        numero: 1,
        estado: "DISPONIBLE",
        sectorId: 1
    }
};

export const ActualizarStand = {
    ...z.toJSONSchema(standActualizacionSchema, {
        target: "openapi-3.0",
        io: "input"
    }),
    example: {
        numero: 1,
        estado: "OCUPADO",
        sectorId: 1,
        artesanoId: 1
    }
};

export const AsignarStand = {
  ...z.toJSONSchema(standAsignacionSchema, {
    target: "openapi-3.0",
    io: "input"
  }),
  example: {
    artesanoId: 1
  }
};