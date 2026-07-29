// Middlewares de error compartidos por toda la app.

// Convierte un ValidationError de Mongoose en una lista de mensajes legibles.
export function detallesDeValidacion(error) {
  return Object.values(error.errors).map((campo) => campo.message);
}

// Ruta que no coincide con ningún handler: 404.
export function noEncontrado(req, res) {
  res.status(404).json({ error: `La ruta ${req.method} ${req.originalUrl} no existe` });
}

// Manejador central: la culpa del cliente es 400, la del servidor 500.
export function manejadorErrores(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Datos inválidos",
      detalles: detallesDeValidacion(err),
    });
  }

  // id con formato incorrecto (p. ej. /tickets/123)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ error: `El valor '${err.value}' no es válido para el campo '${err.path}'` });
  }

  console.error(err.stack);
  res.status(500).json({ error: "Ocurrió un error interno en el servidor." });
}
