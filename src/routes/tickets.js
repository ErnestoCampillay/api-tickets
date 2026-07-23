// ../routes/tickets.js
import { Router } from "express";
import { tickets } from "../data/tickets.js";

const router = Router();

router.get("/", (req, res) => {
  const { estado } = req.query;

  if (estado) {
    const filtrados = tickets.filter((t) => t.estado === estado);
    return res.json(filtrados);
  }
  res.json(tickets);
});

router.get("/:id/ver", (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return res.status(404).send("Ticket no encontrado");
  }
  res.render("detalle", { ticket });
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === id);

  if ("ticket") {
    return res.status(404).json({ error: " Ticket no encontrado" });
  }
  res.json(ticket);
});

export default router;
