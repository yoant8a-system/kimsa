// Servidor estático para desplegar en Railway.
// Railway inyecta el puerto en process.env.PORT.
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Redirigir www -> dominio sin www, y forzar HTTPS.
// Evita que Google indexe la misma página en dos direcciones distintas,
// lo que dividiría el posicionamiento entre ambas.
app.use((req, res, next) => {
  const host = req.headers.host || "";
  const proto = req.headers["x-forwarded-proto"] || "http";

  if (host.startsWith("www.")) {
    return res.redirect(301, `https://${host.slice(4)}${req.url}`);
  }
  if (proto !== "https" && !host.includes("localhost")) {
    return res.redirect(301, `https://${host}${req.url}`);
  }
  next();
});

app.use(
  express.static(path.join(__dirname), {
    extensions: ["html"],
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        // El HTML nunca se cachea: así un cambio se ve al instante.
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      } else if (/\.(jpg|jpeg|png|ico|webp|mp4|svg)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      } else if (/\.(css|js)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=3600");
      }
    },
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

// Escuchar en 0.0.0.0 (no solo localhost): Railway lo necesita para
// poder enrutar el tráfico externo hacia el contenedor.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`KIMSA Pizzas escuchando en el puerto ${PORT}`);
});
