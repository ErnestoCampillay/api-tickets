//server.js

import express from "express";
import path from "node:path";
import ticketsRouter from "./routes/tickets.js";
import { ticket as Ticket } from "./models/tickets.js";
import { conectarDB } from "./data/db.js";

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

// vistas EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// vista tickets
app.get("/", async (req, res, next) => {
  try {
    const ticketsDb = await Ticket.find();
    res.render("index", { tickets: ticketsDb });
  } catch (error) {
    next(error);
  }
});

// salud del server
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/version", (req, res) => res.json({ version: "1.0.0" }));

app.use("/tickets", ticketsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Ocurrio un error interno en el servidor." });
});

await conectarDB();
app.listen(PORT, () => {
  console.log(`${APP_NAME} escuchando en http://localhost:${PORT}`);
});
