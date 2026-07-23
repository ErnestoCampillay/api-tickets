const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Datos de prueba (Tickets)
const tickets = [
  {
    id: 1,
    titulo: "Error en pantalla de login",
    estado: "abierto",
    prioridad: "alta",
  },
  {
    id: 2,
    titulo: "Lentitud en la carga de reporte",
    estado: "cerrado",
    prioridad: "media",
  },
  {
    id: 3,
    titulo: "Falta opción de exportar a PDF",
    estado: "abierto",
    prioridad: "baja",
  },
];

// Middlewares
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- RUTAS VISTAS (HTML) ---

// 1. Tabla principal de tickets (Soporta filtro por query param ?estado=)
app.get("/", (req, res) => {
  const { estado } = req.query;
  let ticketsAmostrar = tickets;

  if (estado) {
    ticketsAmostrar = tickets.filter(
      (t) => t.estado.toLowerCase() === estado.toLowerCase()
    );
  }

  res.render("index", {
    tickets: ticketsAmostrar,
    estadoFiltro: estado || "todos",
  });
});

// 2. Vista HTML de detalle de un ticket (Etapa C)
app.get("/tickets/:id/ver", (req, res) => {
  const { id } = req.params;
  const ticket = tickets.find((t) => t.id === parseInt(id));

  res.render("detalle", { ticket, idBuscado: id });
});

// --- RUTAS API REST (JSON) ---

// Obtener tickets en JSON (con filtro opcional ?estado=)
app.get("/tickets", (req, res) => {
  const { estado } = req.query;

  if (estado) {
    const ticketsFiltrados = tickets.filter(
      (t) => t.estado.toLowerCase() === estado.toLowerCase()
    );
    return res.json(ticketsFiltrados);
  }

  res.json(tickets);
});

// Obtener ticket por ID en JSON
app.get("/tickets/:id", (req, res, next) => {
  const { id } = req.params;
  const ticket = tickets.find((t) => t.id === parseInt(id));

  if (!ticket) {
    const error = new Error(`El ticket con ID ${id} no existe`);
    error.status = 404;
    return next(error);
  }

  res.json(ticket);
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

// Middleware de errores centralizado
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Error interno del servidor",
    status: status,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
