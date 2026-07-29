//server.js

import express from "express";
import path from "node:path";
import ticketsRouter from "./routes/tickets.js";
import vistasRouter from "./routes/vistas.js";
import { conectarDB } from "./data/db.js";
import { noEncontrado, manejadorErrores } from "./middlewares/errores.js";

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "API de Tickets";

//Middleware -Trae los http en JSON
app.use(express.json());

// Cuerpos enviados por formularios HTML
app.use(express.urlencoded({ extended: true }));

//Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// vistas EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// salud del server
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/version", (req, res) => res.json({ version: "1.0.0" }));

// Las vistas HTML van primero: /tickets/nuevo debe ganarle a /tickets/:id del API
app.use("/", vistasRouter);
app.use("/tickets", ticketsRouter);

app.use(noEncontrado);
app.use(manejadorErrores);

await conectarDB();
app.listen(PORT, () => {
  console.log(`${APP_NAME} escuchando en http://localhost:${PORT}`);
});
