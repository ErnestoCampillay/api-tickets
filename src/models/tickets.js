import mongoose from "mongoose";

// Valores permitidos: se comparten con el router para validar los filtros
export const ESTADOS = ["abierto", "en progreso", "cerrado"];
export const PRIORIDADES = ["alta", "media", "baja"];

const ticketSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"],
      maxlength: [120, "El título no puede superar los 120 caracteres"],
    },
    estado: {
      type: String,
      enum: {
        values: ESTADOS,
        message: `El estado '{VALUE}' no es válido. Usa: ${ESTADOS.join(", ")}`,
      },
      default: "abierto",
    },
    prioridad: {
      type: String,
      enum: {
        values: PRIORIDADES,
        message: `La prioridad '{VALUE}' no es válida. Usa: ${PRIORIDADES.join(", ")}`,
      },
      default: "media",
    },
  },
  { timestamps: true },
);

export const ticket = mongoose.model("Ticket", ticketSchema);
