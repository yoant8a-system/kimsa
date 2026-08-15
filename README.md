# KIMSA Pizzas - Landing page

Landing page de conversión para una pizzería con 3 sucursales en Ayacucho, Perú.
Construida con HTML, CSS y JavaScript puros: sin frameworks, sin build, sin dependencias.

**Sitio en vivo:** https://kimsapizza.com

---

## El problema

El negocio recibía sus pedidos por WhatsApp, pero no tenía presencia web: no aparecía en Google cuando alguien buscaba "pizza en Ayacucho", y cada pedido empezaba desde cero con el cliente preguntando la carta y los precios por chat.

## La solución

Una sola página que resuelve dos cosas a la vez:

1. **Posicionamiento en búsquedas locales**, para que el negocio aparezca cuando alguien busca pizza o delivery en Ayacucho.
2. **Convertir esa visita en un pedido**, con la menor fricción posible: el cliente arma su pedido en la web y llega a WhatsApp con el mensaje ya escrito.

---

## Decisiones técnicas

**Sin framework.** Una landing de una sola página no justifica React ni un bundler. HTML/CSS/JS planos cargan más rápido, y la velocidad es un factor de posicionamiento en Google — especialmente en móvil, que es desde donde llega casi todo el tráfico de un negocio de comida.

**Carta como fuente única de verdad.** Toda la carta, sucursales y zonas de reparto viven en un solo archivo (`js/menu-data.js`). Desde ahí se pinta el menú, se calcula el total del pedido y se genera el marcado de datos estructurados para Google. Cambiar un precio es editar un número en un lugar.

**Pedido por WhatsApp, no carrito de e-commerce.** El negocio ya operaba por WhatsApp y no quería procesar pagos online. La página arma el mensaje (platos, cantidades, total, dirección y distrito) y abre el chat con todo escrito; la confirmación la sigue haciendo una persona. Menos fricción para el cliente y cero cambios en la operación del negocio.

**Sin número de teléfono visible.** El contacto va detrás de botones con evento de analítica, para poder medir cuántos pedidos genera realmente la web. Si el navegador no logra abrir WhatsApp, se revela el número como respaldo para no perder al cliente.

**SEO local.** Datos estructurados `Restaurant` por sucursal (con coordenadas y horarios), `Menu` con todos los platos y precios, y `FAQPage` para poder aparecer como resultado enriquecido. Todo se genera automáticamente desde los mismos datos del menú, así no se desincroniza del contenido visible.

---

## Estructura

```
index.html          Estructura, metadatos SEO y datos estructurados
css/style.css       Estilos, mobile-first, paleta en variables CSS
js/menu-data.js     Carta, sucursales, distritos (fuente única de verdad)
js/script.js        Menú, carrito, mensaje de WhatsApp, JSON-LD, menú móvil
assets/             Imágenes y video optimizados para web
server.js           Servidor estático (Express) con caché y redirecciones
robots.txt          Indexación
sitemap.xml         Mapa del sitio
```

## Detalles de implementación

- **Menú móvil** desplegable, que se cierra solo al elegir una opción o al tocar fuera.
- **Video** que se reproduce al entrar en pantalla vía `IntersectionObserver`, con reintento silenciado cuando el navegador bloquea el audio.
- **Galería** con layout tipo bento usando CSS Grid.
- **Paleta de marca** extraída del logo del cliente y expuesta como variables CSS, para poder retocarla sin tocar el resto del código.
- **Accesibilidad**: `aria-expanded` y `aria-label` en el menú, texto alternativo descriptivo en todas las imágenes.

## Desarrollo local

```bash
npm install
npm start          # http://localhost:3000
```

Alternativamente, cualquier servidor estático sirve: `python3 -m http.server`.

## Despliegue

Railway conectado a este repositorio: cada `git push` a `main` republica el sitio automáticamente.
El servidor Express sirve los archivos estáticos, aplica cabeceras de caché por tipo de archivo
y redirige `www` y HTTP hacia la versión canónica en HTTPS.

---

## Créditos y uso

Desarrollado por **Yoant Ochoa**.

El código es de libre consulta con fines de referencia. El logo, las fotografías, el video y el nombre **KIMSA Pizza & Pasta** son propiedad del negocio y no pueden reutilizarse.
