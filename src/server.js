import http from "http";

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "API de Tickets";

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200); // 200 significa "OK"
    res.end(JSON.stringify({ mensaje: `¡Bienvenido a ${APP_NAME}!` }));
  } else if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
  } else if (req.url === "/version" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ version: "1.0.0" }));
  } else if (req.url === "/tickets" && req.method === "GET") {
    // tickets simulados (inventados)
    const ticketsDeEjemplo = [
      { id: 1, titulo: "Fallo en la conexión Wi-Fi", estado: "abierto" },
      { id: 2, titulo: "Actualización de software", estado: "en progreso" },
      { id: 3, titulo: "Reemplazo de teclado", estado: "cerrado" },
    ];
    res.writeHead(200);
    res.end(JSON.stringify(ticketsDeEjemplo));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} escuchando en http://localhost:${PORT}`);
});
