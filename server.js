// Servidor estático para desplegar en Railway.
// Railway inyecta el puerto en process.env.PORT.
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------
// Versionado automático de assets
// ------------------------------------------------------------------
// Problema que resuelve: Cloudflare cachea css/js durante horas. Si se
// publica un cambio, los visitantes siguen viendo la versión vieja y la
// página se ve rota (HTML nuevo + CSS viejo).
//
// Solución: en el HTML los assets se escriben como "style.css?v=__V__",
// y aquí se reemplaza __V__ por una marca que cambia en cada despliegue
// (la fecha de modificación más reciente de css/ y js/). Al cambiar la
// URL, ninguna caché puede servir la versión anterior.
function calcularVersion() {
  const carpetas = ["css", "js"];
  let ultima = 0;
  for (const c of carpetas) {
    const dir = path.join(__dirname, c);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const { mtimeMs } = fs.statSync(path.join(dir, f));
      if (mtimeMs > ultima) ultima = mtimeMs;
    }
  }
  return Math.floor(ultima / 1000).toString(36);
}

const VERSION = calcularVersion();
console.log(`Version de assets: ${VERSION}`);

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

// Servir el HTML con la versión ya inyectada
function servirHtml(nombreArchivo, res) {
  const ruta = path.join(__dirname, nombreArchivo);
  if (!fs.existsSync(ruta)) return false;
  const html = fs.readFileSync(ruta, "utf8").replace(/__V__/g, VERSION);
  res.setHeader("Content-Type", "text/html; charset=UTF-8");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.send(html);
  return true;
}

app.get(/^\/(|[a-z0-9-]+\.html)$/i, (req, res, next) => {
  const nombre = req.path === "/" ? "index.html" : req.path.slice(1);
  if (!servirHtml(nombre, res)) next();
});

app.use(
  express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
      if (/\.(jpg|jpeg|png|ico|webp|mp4|svg)$/.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      } else if (/\.(css|js)$/.test(filePath)) {
        // Se pueden cachear mucho tiempo porque la URL lleva ?v=VERSION:
        // al cambiar el archivo, cambia la URL y la caché queda invalidada.
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    },
  })
);

app.use((req, res) => {
  res.status(404);
  if (!servirHtml("index.html", res)) res.send("No encontrado");
});

// Escuchar en 0.0.0.0 (no solo localhost): Railway lo necesita para
// poder enrutar el tráfico externo hacia el contenedor.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`KIMSA Pizzas escuchando en el puerto ${PORT}`);
});
