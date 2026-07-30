# API de Tickets

CRUD completo de tickets con Express 5, Mongoose y vistas EJS.
Corresponde al **Módulo 5 — Clase 5: CRUD completo (API REST + MongoDB)** del curso Desarrollo Backend con Node.js.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y completa MONGODB_URI con tu cadena de Atlas
npm run dev            # http://localhost:3000
```

Variables de entorno:

| Variable      | Descripción                          |
| ------------- | ------------------------------------ |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas  |
| `PORT`        | Puerto del servidor (por defecto 3000) |
| `APP_NAME`    | Nombre mostrado al arrancar          |

## Modelo

```js
{
  titulo: String,     // obligatorio, 3-120 caracteres
  estado: String,     // "abierto" | "en progreso" | "cerrado"  (por defecto "abierto")
  prioridad: String,  // "alta" | "media" | "baja"              (por defecto "media")
  createdAt, updatedAt
}
```

## API REST

| Operación   | Verbo    | Ruta           | Éxito |
| ----------- | -------- | -------------- | ----- |
| Crear       | `POST`   | `/tickets`     | 201   |
| Leer        | `GET`    | `/tickets`     | 200   |
| Leer uno    | `GET`    | `/tickets/:id` | 200   |
| Actualizar  | `PATCH`  | `/tickets/:id` | 200   |
| Eliminar    | `DELETE` | `/tickets/:id` | 204   |

### Paginación, filtros y ordenación

`GET /tickets` acepta estos parámetros de consulta:

| Parámetro   | Por defecto   | Notas                                                          |
| ----------- | ------------- | -------------------------------------------------------------- |
| `page`      | `1`           | Entero ≥ 1                                                     |
| `limit`     | `10`          | Entero entre 1 y 100                                           |
| `estado`    | —             | `abierto`, `en progreso` o `cerrado`                           |
| `prioridad` | —             | `alta`, `media` o `baja`                                       |
| `sort`      | `-createdAt`  | `titulo`, `estado`, `prioridad`, `createdAt`, `updatedAt`; `-` = descendente |

Respuesta:

```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "tickets": [ /* ... */ ]
}
```

### Códigos de estado

| Situación                | Código |
| ------------------------ | ------ |
| Creado                   | 201    |
| OK (leer / actualizar)   | 200    |
| Eliminado (sin cuerpo)   | 204    |
| Entrada inválida         | 400    |
| No encontrado            | 404    |
| Error del servidor       | 500    |

La entrada inválida (falta `titulo`, `estado` fuera del `enum`, `id` mal formado, `page`/`limit` incorrectos) responde **400**, no 500: la culpa es del cliente.

### Ejemplos con curl

```bash
# Crear
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Impresora sin red","prioridad":"alta"}'

# Listar filtrando y paginando
curl "http://localhost:3000/tickets?estado=abierto&page=1&limit=5&sort=-createdAt"

# Actualizar
curl -X PATCH http://localhost:3000/tickets/<id> \
  -H "Content-Type: application/json" \
  -d '{"estado":"cerrado"}'

# Eliminar
curl -i -X DELETE http://localhost:3000/tickets/<id>
```

## Colección de pruebas

`postman/API-Tickets.postman_collection.json` — impórtala en Postman o Insomnia.
Incluye los cuatro verbos, los casos de paginación/filtros y los casos de error (400 y 404).
La variable `ticketId` se rellena sola al ejecutar *Crear ticket*.

## Vistas web (EJS)

| Ruta                    | Método | Descripción              |
| ----------------------- | ------ | ------------------------ |
| `/`                     | GET    | Listado de tickets       |
| `/tickets/nuevo`        | GET    | Formulario de creación   |
| `/tickets/nuevo`        | POST   | Crea y redirige a `/`    |
| `/tickets/:id/ver`      | GET    | Detalle                  |
| `/tickets/:id/editar`   | GET    | Formulario de edición    |
| `/tickets/:id/editar`   | POST   | Actualiza y redirige     |
| `/tickets/:id/eliminar` | POST   | Elimina y redirige a `/` |

Los formularios HTML solo pueden enviar `GET` y `POST`, por eso las vistas usan `POST` mientras que la API usa `PATCH` y `DELETE`.

## Estructura

```
src/
  server.js              # app, middlewares y arranque
  data/db.js             # conexión a MongoDB
  models/tickets.js      # esquema + validaciones
  routes/tickets.js      # API REST (JSON)
  routes/vistas.js       # vistas HTML (EJS)
  middlewares/errores.js # 404 y manejador central de errores
views/                   # plantillas EJS
postman/                 # colección de pruebas
```

## Scripts

| Script                | Qué hace                          |
| --------------------- | --------------------------------- |
| `npm run dev`         | Servidor con `--watch`            |
| `npm run build:dev`   | Bundle de desarrollo con webpack  |
| `npm run build:prod`  | Bundle de producción              |
| `npm start`           | Ejecuta el bundle de `dist/`      |
