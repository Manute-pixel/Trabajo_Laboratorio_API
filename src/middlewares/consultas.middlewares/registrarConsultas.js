import { crearConsulta } from "../../services/consulta.service.js";

const rutasPermitidas = ["/stands", "/productos", "/artesanos"];

export const registrarConsultas = () => {
  return (req, res, next) => {
    try {
      if (req.method !== "GET") return next();

      const ruta = req.path;
      if (!rutasPermitidas.includes(ruta)) return next();

      res.once("finish", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) return;

        const tipoConsulta = req.baseUrl
          .split("/")
          .filter(Boolean)[0]
          ?.toUpperCase();

        if (!tipoConsulta) return;

        const busqueda = {
          ruta: ruta,
          parametros: req.params,
          filtros: req.query,
        };
        crearConsulta(tipoConsulta, busqueda)
          .then(() => {
            console.log("Consulta registrada en la base de datos");
          })
          .catch((error) => {
            console.error("Error al registrar consulta:", error);
          });
      });

      next();
    } catch (error) {
      next(error);
    }
  };
};
