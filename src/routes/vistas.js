// Rutas que devuelven HTML (EJS). El API REST en JSON está en routes/tickets.js.
// Un formulario del navegador solo sabe enviar GET y POST, por eso aquí
// editar y eliminar usan POST y terminan en un redirect.

import { Router } from "express";
import mongoose from "mongoose";
import { ticket as Ticket, ESTADOS, PRIORIDADES } from "../models/tickets.js";
import { detallesDeValidacion } from "../middlewares/errores.js";

const router = Router();

// Listado
router.get("/", async (req, res, next) => {
  try {
    const tickets = await Ticket.find().sort("-createdAt");
    res.render("index", { tickets });
  } catch (error) {
    next(error);
  }
});

// Formulario de creación
router.get("/tickets/nuevo", (req, res) => {
  res.render("nuevo", { errores: [], valores: {}, estados: ESTADOS, prioridades: PRIORIDADES });
});

// Crear desde el formulario
router.post("/tickets/nuevo", async (req, res, next) => {
  const { titulo, estado, prioridad } = req.body;
  try {
    await Ticket.create({ titulo, estado, prioridad });
    res.redirect("/");
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).render("nuevo", {
        errores: detallesDeValidacion(error),
        valores: { titulo, estado, prioridad },
        estados: ESTADOS,
        prioridades: PRIORIDADES,
      });
    }
    next(error);
  }
});

// Detalle
router.get("/tickets/:id/ver", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("El id no tiene un formato válido de MongoDB");
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket no encontrado");

    res.render("detalle", { ticket });
  } catch (error) {
    next(error);
  }
});

// Formulario de edición
router.get("/tickets/:id/editar", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("El id no tiene un formato válido de MongoDB");
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).send("Ticket no encontrado");

    res.render("editar", {
      ticket,
      errores: [],
      estados: ESTADOS,
      prioridades: PRIORIDADES,
    });
  } catch (error) {
    next(error);
  }
});

// Guardar la edición
router.post("/tickets/:id/editar", async (req, res, next) => {
  const { titulo, estado, prioridad } = req.body;
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("El id no tiene un formato válido de MongoDB");
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { titulo, estado, prioridad },
      { new: true, runValidators: true },
    );

    if (!ticket) return res.status(404).send("Ticket no encontrado");

    res.redirect(`/tickets/${ticket._id}/ver`);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).render("editar", {
        ticket: { _id: req.params.id, titulo, estado, prioridad },
        errores: detallesDeValidacion(error),
        estados: ESTADOS,
        prioridades: PRIORIDADES,
      });
    }
    next(error);
  }
});

// Eliminar desde el listado
router.post("/tickets/:id/eliminar", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("El id no tiene un formato válido de MongoDB");
    }

    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).send("Ticket no encontrado");

    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

export default router;
