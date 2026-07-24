import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    estado: { type: String, required: true },
    prioridad: { type: String, required: true },
  },
  { timestamps: true },
);

export const ticket = mongoose.model("Ticket", ticketSchema);
