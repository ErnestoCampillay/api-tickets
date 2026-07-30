//server.js

import express from "express";
import ticketsRouter from "./routes/tickets.js";
import { conectarDB } from "./data/db.js";
import { noEncontrado, manejadorErrores } from "./middlewares/errores.js";

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "API de Tickets";

//Middleware -Trae los http en JSON
app.use(express.json());

//Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Indice del server
app.get("/", (req, res) =>
  res.json({
    nombre: APP_NAME,
    endpoints: ["/tickets", "/health", "/version"],
  }),
);

// Endpoints
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/version", (req, res) => res.json({ version: "1.0.0" }));
app.get("/tickets", ticketsRouter);

// Errores
app.use(noEncontrado);
app.use(manejadorErrores);

await conectarDB();
app.listen(PORT, () => {
  console.log(`${APP_NAME} escuchando en http://localhost:${PORT}`);
});
