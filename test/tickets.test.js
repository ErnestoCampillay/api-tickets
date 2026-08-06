import request from "supertest";
import mongoose, { disconnect, mongo } from "mongoose";
import app from "../src/app.js";
import { conectarDB } from "../src/data/db.js";
import { ticket as Ticket } from "../src/models/tickets.js";
import { firmarToken } from "../src/middlewares/auth.js";

const token = firmarToken({
  _id: new mongoose.Types.ObjectId(),
  rol: "usuario",
});

// conectarse al servidor de mongo
beforeAll(async () => {
  await conectarDB();
});

// desconectar al servidor de mongo
afterAll(async () => {
  await mongoose.disconnect();
});

// empezar sin datos
afterEach(async () => {
  await Ticket.deleteMany({});
});

test("POST /tickets crea un ticket y responde 201", async () => {
  const res = await request(app)
    .post("/tickets")
    .set("Authorization", `Bearer ${token}`)
    .send({ titulo: "Impresora sin red", prioridad: "alta" });

  expect(res.status).toBe(201);
  expect(res.body.titulo).toBe("Impresora sin red");
  expect(res.body.prioridad).toBe("alta");
  expect(res.body.estado).toBe("abierto");
  expect(res.body).toHaveProperty("_id");
});
