# API de Tickets

API REST de tickets con Express 5, Mongoose y autenticación con JWT.
Corresponde a los módulos 5 a 8 del curso Desarrollo Backend con Node.js.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y completa MONGODB_URI y JWT_SECRET
npm run dev            # http://localhost:3000
```

Variables de entorno:

| Variable      | Descripción                            |
| ------------- | -------------------------------------- |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas    |
| `PORT`        | Puerto del servidor (por defecto 3000) |
| `APP_NAME`    | Nombre mostrado al arrancar            |
| `JWT_SECRET`  | Secreto para firmar los tokens         |

Para generar un `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Modelos

```js
// Ticket
{
  titulo: String,     // obligatorio, 3-120 caracteres
  estado: String,     // "abierto" | "en progreso" | "cerrado"  (por defecto "abierto")
  prioridad: String,  // "alta" | "media" | "baja"              (por defecto "media")
  createdAt, updatedAt
}

// Usuario
{
  email: String,         // obligatorio, único, en minúsculas
  passwordHash: String,  // hash bcrypt; nunca se devuelve
  rol: String,           // "usuario" | "admin"  (por defecto "usuario")
  createdAt, updatedAt
}
```

## Autenticación

| Operación | Verbo  | Ruta             | Éxito | Devuelve                |
| --------- | ------ | ---------------- | ----- | ----------------------- |
| Registro  | `POST` | `/auth/registro` | 201   | `{ id, email, rol }`    |
| Login     | `POST` | `/auth/login`    | 200   | `{ token }`             |
| Quién soy | `GET`  | `/auth/yo`       | 200   | `{ id, email, rol }`    |

El flujo es **registro → login → token → petición protegida**. El token se manda en cada petición:

```
Authorization: Bearer eyJhbGciOi...
```

Caduca en **1 hora**. El `rol` no se acepta desde el cuerpo del registro: todo usuario nace como `usuario` y el rol se otorga desde el servidor.

El login responde el mismo `Credenciales inválidas` tanto si el email no existe como si la contraseña es incorrecta, para no revelar qué correos están registrados.

## API REST

| Operación  | Verbo    | Ruta           | Éxito | Protección                       |
| ---------- | -------- | -------------- | ----- | -------------------------------- |
| Crear      | `POST`   | `/tickets`     | 201   | Token                            |
| Leer       | `GET`    | `/tickets`     | 200   | Pública                          |
| Leer uno   | `GET`    | `/tickets/:id` | 200   | Pública                          |
| Actualizar | `PATCH`  | `/tickets/:id` | 200   | Token                            |
| Eliminar   | `DELETE` | `/tickets/:id` | 204   | Token + rol `admin`              |

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

| Situación                          | Código |
| ---------------------------------- | ------ |
| Creado                             | 201    |
| OK (leer / actualizar)             | 200    |
| Eliminado (sin cuerpo)             | 204    |
| Entrada inválida                   | 400    |
| No autenticado (sin token válido)  | 401    |
| Autenticado pero sin permisos      | 403    |
| No encontrado                      | 404    |
| Email ya registrado                | 409    |
| Error del servidor                 | 500    |

La entrada inválida (falta `titulo`, `estado` fuera del `enum`, `id` mal formado, `page`/`limit` incorrectos) responde **400**, no 500: la culpa es del cliente.

**401 no es 403.** El 401 significa "no sé quién eres": falta el token o no es válido. El 403 significa "sé quién eres y no puedes": el token es correcto pero el rol no alcanza.

### Ejemplos con curl

```bash
# Registro
curl -X POST http://localhost:3000/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@correo.com","password":"secreta123"}'

# Login: guarda el token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@correo.com","password":"secreta123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# Crear (necesita token)
curl -X POST http://localhost:3000/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Impresora sin red","prioridad":"alta"}'

# Listar filtrando y paginando (público)
curl "http://localhost:3000/tickets?estado=abierto&page=1&limit=5&sort=-createdAt"

# Actualizar (necesita token)
curl -X PATCH http://localhost:3000/tickets/<id> \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"estado":"cerrado"}'

# Eliminar (necesita token de un usuario con rol admin)
curl -i -X DELETE http://localhost:3000/tickets/<id> \
  -H "Authorization: Bearer $TOKEN"
```

## Tiempo real (Socket.IO)

La API emite eventos cuando cambian los tickets. El WebSocket **no sustituye a la API REST**: solo avisa, la verdad sigue en la base de datos.

| Evento               | Cuándo               | Destinatario  |
| -------------------- | -------------------- | ------------- |
| `bienvenida`         | Al conectar          | Ese cliente   |
| `ticket:creado`      | `POST /tickets`      | Todos         |
| `ticket:confirmado`  | `POST /tickets`      | Solo el autor |
| `ticket:actualizado` | `PATCH /tickets/:id` | Todos         |

El socket se autentica con **el mismo JWT** que la API, enviado en el handshake. Sin token válido la conexión se rechaza con `connect_error`:

```js
const socket = io({ auth: { token: "eyJhbGciOi..." } });
```

Cada conexión entra a la sala `usuario:<id>`, tomada del token firmado y no de lo que diga el cliente.

Esto es una API: no sirve ninguna página. Para ver los eventos, usa una petición **Socket.IO** en Postman contra `http://localhost:3000`, con el token en el handshake (`auth.token`), y suscríbete a los cuatro eventos de la tabla.

## Colección de pruebas

`postman/API-Tickets.postman_collection.json` — impórtala en Postman o Insomnia.
Incluye el registro y el login, los cinco endpoints del CRUD, los casos de paginación/filtros y los errores (400, 401, 403, 404 y 409).

La colección manda `Authorization: Bearer {{token}}` heredado en todos los requests; los públicos y los de error lo sobrescriben. Tres variables se rellenan solas al ejecutarla en orden:

| Variable     | La rellena             |
| ------------ | ---------------------- |
| `token`      | *Login*                |
| `tokenAdmin` | *Login admin*          |
| `ticketId`   | *Crear ticket*         |

*Login admin* necesita un usuario con rol `admin`: regístralo primero y cámbiale el rol en la base, porque la API no permite autoconcederse permisos.

## Seguridad

`app.use(helmet())` fija las cabeceras que mitigan clickjacking, sniffing y ataques parecidos. Es lo primero que se registra en `src/app.js`, porque un middleware solo protege lo que viene detrás de él.

Ningún endpoint devuelve datos sensibles: `passwordHash` es `select: false` en el esquema, y el manejador central de errores registra el stack en el servidor pero responde un mensaje genérico al cliente.

Los secretos viven en el entorno: `.env` está en el `.gitignore` y `.env.example` solo lleva valores de ejemplo.

## Estructura

```
src/
  app.js                             # la app de Express: middlewares y routers
  server.js                          # arranque: servidor HTTP, Socket.IO y listen
  data/db.js                         # conexión a MongoDB
  models/tickets.js                  # esquema de Ticket + validaciones
  models/usuarios.js                 # esquema de Usuario + roles
  routes/tickets.js                  # URL + método -> controlador
  routes/auth.js                     # registro, login y /auth/yo
  controllers/tickets.controller.js  # lee req, responde res
  services/tickets.service.js        # el único que habla con el modelo
  middlewares/errores.js             # 404 y manejador central de errores
  middlewares/auth.js                # firmarToken, requireAuth y requireRol
postman/                             # colección de pruebas
```

Las capas van en una sola dirección: **ruta → controlador → servicio → modelo**. El servicio no conoce `req` ni `res`, y por eso los `io.emit` viven en el controlador: a `io` se llega por `req.app`.

`routes/auth.js` todavía no está separado en capas — es el reto del Módulo 8.

## Scripts

| Script                | Qué hace                          |
| --------------------- | --------------------------------- |
| `npm run dev`         | Servidor con `--watch`            |
| `npm run build:dev`   | Bundle de desarrollo con webpack  |
| `npm run build:prod`  | Bundle de producción              |
| `npm start`           | Ejecuta el bundle de `dist/`      |
