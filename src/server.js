import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");

    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200);

        res.end(JSON.stringify({
            mensaje: "Bienvenido a la API de Tickets"
        }));

    } else if (req.url === "/health" && req.method === "GET") {

        res.writeHead(200);

        res.end(JSON.stringify({
            status: "ok"
        }));

    } else {

        res.writeHead(404);

        res.end(JSON.stringify({
            error: "Ruta no encontrada"
        }));
    }

});

server.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});