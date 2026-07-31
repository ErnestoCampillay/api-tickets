import mongoose from "mongoose";

export const ROLES = ["usuario", "admin"];

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "El email no tiene un formato válido"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // no se incluye en las consultas salvo que se pida
    },
    rol: {
      type: String,
      enum: {
        values: ROLES,
        message: `El rol '{VALUE}' no es válido. Usa: ${ROLES.join(", ")}`,
      },
      default: "usuario",
    },
  },
  { timestamps: true },
);

export const usuario = mongoose.model("Usuario", usuarioSchema);
