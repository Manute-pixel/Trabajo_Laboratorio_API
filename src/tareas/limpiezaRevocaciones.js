import {eliminarRevocacionesVencidas} from '../services/revocaciones.js';

const INTERVALOS_MS = 60 * 60 * 1000; // 1 hora

export const iniciarLimpiezaRevocaciones = () => {
    const ejecutarLimpieza = async () => {
        try {
            const {count} = await eliminarRevocacionesVencidas();
            console.log("Revocaciones vencidas eliminadas:", count);
        }
        catch (error) {
            console.error("Fallo de limpieza:", error.message);
        }
        finally {
            setTimeout(ejecutarLimpieza, INTERVALOS_MS).unref();
        }
    };
    void ejecutarLimpieza();
};
