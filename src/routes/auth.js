// Registro, login e identidad del usuario autenticado.

import { Router } from "express";
import bcrypt from "bcrypt";
import { usuario as Usuario } from "../models/usuarios.js";
import { firmarToken, requireAuth } from "../middlewares/auth.js";
import { detallesDeValidacion } from "../middlewares/errores.js";

const router = Router();
const VUELTAS = 10;

// POST /auth/registro
router.post("/registro", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
    }

    const passwordHash = await bcrypt.hash(password, VUELTAS);

    // El rol no se toma del cuerpo: nadie se autoconcede permisos
    const usuarioNuevo = await Usuario.create({ email, passwordHash });

    // Nunca devolvemos el passwordHash
    res.status(201).json({
      id: usuarioNuevo._id,
      email: usuarioNuevo.email,
      rol: usuarioNuevo.rol,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Ese email ya está registrado" });
    }
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ error: "Datos inválidos", detalles: detallesDeValidacion(error) });
    }
    next(error);
  }
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }

    // lowercase del esquema aplica al guardar, no al buscar
    const usuarioDb = await Usuario.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    const ok = usuarioDb && (await bcrypt.compare(password, usuarioDb.passwordHash));

    // Mismo mensaje falle el email o la contraseña
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({ token: firmarToken(usuarioDb) });
  } catch (error) {
    next(error);
  }
});

// GET /auth/yo
router.get("/yo", requireAuth, async (req, res, next) => {
  try {
    const usuarioDb = await Usuario.findById(req.user.sub);

    if (!usuarioDb) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ id: usuarioDb._id, email: usuarioDb.email, rol: usuarioDb.rol });
  } catch (error) {
    next(error);
  }
});

export default router;
