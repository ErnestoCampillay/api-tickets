import { Router } from "express";
import { ticket as Ticket } from "../models/tickets.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { estado } = req.query;

    const filtro = estado ? { estado } : {};

    const ticketsDb = await Ticket.find(filtro);
    res.json(ticketsDb);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los tickets" });
  }
});

router.get("/:id/ver", async (req, res) => {
  try {
    // busca el documento por el _id de Mongo
    const ticketDb = await Ticket.findById(req.params.id);

    if (!ticketDb) {
      return res.status(404).send("Ticket no encontrado");
    }
    res.render("detalle", { ticket: ticketDb });
  } catch (error) {
    // Si pasamos un id que no tiene el formato de MongoDB, lanzará un error que cae aquí
    res.status(500).send("Error de formato al buscar el ticket");
  }
});

router.get("/nuevo", (req, res) => {
  res.render("nuevo");
});

router.post("/", async (req, res) => {
  try {
    const { titulo, estado, prioridad } = req.body;

    await Ticket.create({
      titulo,
      estado,
      prioridad,
    });

    res.redirect("/");
  } catch (error) {
    console.error("Error al guardar el ticket:", error);
    res.status(500).send("Ocurrió un error al intentar crear el ticket.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ticketDb = await Ticket.findById(req.params.id);

    if (!ticketDb) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }
    res.json(ticketDb);
  } catch (error) {
    res.status(500).json({ error: "Error de formato al obtener el ticket" });
  }
});

export default router;
