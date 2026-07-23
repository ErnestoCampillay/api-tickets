//server.js
//import http from "node:http";
import express from "express";
import path from "node:path";
import ticketsRouter from "./routes/tickets.js";
import { tickets } from "./data/tickets.js";

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "API de Tickets";

//Middleware -TAre los http en JSON
app.use(express.json());

//Middleware trae metadota http y url
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// vistas EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// vista tickets
app.get("/", (req, res) => res.render("index", { tickets }));

// salud del server
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/version", (req, res) => res.json({ version: "1.0.0" }));

app.use("/tickets", ticketsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocurrio un error interno en el servidor." });
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} escuchando en http://localhost:${PORT}`);
});

// const server = http.createServer((req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   if (req.url === "/" && req.method === "GET") {
//     res.writeHead(200); // 200 significa "OK"
//     res.end(JSON.stringify({ mensaje: `¡Bienvenido a ${APP_NAME}!` }));
//   } else if (req.url === "/health" && req.method === "GET") {
//     res.writeHead(200);
//     res.end(JSON.stringify({ status: "ok" }));
//   } else if (req.url === "/version" && req.method === "GET") {
//     res.writeHead(200);
//     res.end(JSON.stringify({ version: "1.0.0" }));
//   } else if (req.url === "/tickets" && req.method === "GET") {
//     // tickets simulados (inventados)
//     const ticketsDeEjemplo = [
//       { id: 1, titulo: "Fallo en la conexión Wi-Fi", estado: "abierto" },
//       { id: 2, titulo: "Actualización de software", estado: "en progreso" },
//       { id: 3, titulo: "Reemplazo de teclado", estado: "cerrado" },
//     ];
//     res.writeHead(200);
//     res.end(JSON.stringify(ticketsDeEjemplo));
//   } else {
//     res.writeHead(404);
//     res.end(JSON.stringify({ error: "Ruta no encontrada" }));
//   }
// });

//server.listen(PORT, () => {
//  console.log(`🚀 ${APP_NAME} escuchando en http://localhost:${PORT}`);
//});
