import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { conectarDB } from "../src/data/db.js";
import { ticket as Ticket } from "../src/models/tickets.js";
import { firmarToken } from "../src/middlewares/auth.js";

const token = firmarToken({
  _id: new mongoose.Types.ObjectId(),
  rol: "usuario",
});

// Conectarse al servidor de Mongo antes de ejecutar los tests
beforeAll(async () => {
  await conectarDB();
});

// Desconectar del servidor de Mongo al finalizar todos los tests
afterAll(async () => {
  await mongoose.disconnect();
});

// Limpiar la colección de tickets después de cada prueba
afterEach(async () => {
  await Ticket.deleteMany({});
});

describe("Pruebas del endpoint /tickets", () => {
  // 1. Camino feliz: Crear ticket correctamente (201)
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

  // 2. Caso de error: Crear ticket inválido sin campos obligatorios (400)
  test("POST /tickets con datos inválidos responde 400 Bad Request", async () => {
    const res = await request(app)
      .post("/tickets")
      .set("Authorization", `Bearer ${token}`)
      .send({ prioridad: "alta" }); // Falta el 'titulo' obligatorio

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // 3. Caso de error: Consultar un ticket con ID inexistente (404)
  test("GET /tickets/:id con un ID inexistente responde 404 Not Found", async () => {
    // Generamos un ObjectId válido de MongoDB pero que no está guardado en la BD
    const idInexistente = new mongoose.Types.ObjectId();

    const res = await request(app)
      .get(`/tickets/${idInexistente}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
