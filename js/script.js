// ============================================================
// KIMSA Pizzas - lógica de la página
// Usa los datos de menu-data.js como única fuente de verdad
// para: pintar el menú, armar el mensaje de WhatsApp y generar
// el JSON-LD del menú (SEO / rich results).
// ============================================================

const cart = {}; // { "Nombre del plato": qty }

// Ubicación y envío del cliente (resultado de cotizarEnvio + método). Solo vive
// en memoria mientras la página está abierta; ver "Envío" más abajo.
let envio = null;

function money(n) {
  return `S/ ${n.toFixed(2)}`;
}

// ---------- Pintar el menú ----------
function renderMenu() {
  const wrap = document.getElementById("menu-content");
  const tabsWrap = document.getElementById("menu-tabs");
  wrap.innerHTML = "";
  tabsWrap.innerHTML = "";

  MENU.forEach((cat, idx) => {
    // tab
    const tab = document.createElement("button");
    tab.className = "menu-tab" + (idx === 0 ? " active" : "");
    tab.textContent = cat.category;
    tab.addEventListener("click", () => {
      document.querySelectorAll(".menu-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`cat-${idx}`).scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tabsWrap.appendChild(tab);

    // sección
    const section = document.createElement("div");
    section.className = "menu-category";
    section.id = `cat-${idx}`;

    const h3 = document.createElement("h3");
    h3.textContent = cat.category;
    section.appendChild(h3);

    const grid = document.createElement("div");
    grid.className = "menu-grid";

    cat.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "menu-item";

      const info = document.createElement("div");
      info.className = "menu-item-info";
      info.innerHTML = `
        <h4>${item.name}</h4>
        ${item.desc ? `<p>${item.desc}</p>` : ""}
        <span class="menu-item-price">${money(item.price)}</span>
      `;

      const qtyControl = document.createElement("div");
      qtyControl.className = "qty-control";
      qtyControl.innerHTML = `
        <button class="qty-btn" data-action="minus" aria-label="Quitar ${item.name}">-</button>
        <span class="qty-value">0</span>
        <button class="qty-btn" data-action="plus" aria-label="Agregar ${item.name}">+</button>
      `;

      const qtyValueEl = qtyControl.querySelector(".qty-value");
      const minusBtn = qtyControl.querySelector('[data-action="minus"]');
      minusBtn.disabled = true;

      qtyControl.querySelector('[data-action="plus"]').addEventListener("click", () => {
        cart[item.name] = (cart[item.name] || 0) + 1;
        qtyValueEl.textContent = cart[item.name];
        minusBtn.disabled = false;
        updateCartBar();
      });

      qtyControl.querySelector('[data-action="minus"]').addEventListener("click", () => {
        if (!cart[item.name]) return;
        cart[item.name] -= 1;
        if (cart[item.name] <= 0) delete cart[item.name];
        qtyValueEl.textContent = cart[item.name] || 0;
        minusBtn.disabled = !cart[item.name];
        updateCartBar();
      });

      card.appendChild(info);
      card.appendChild(qtyControl);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    wrap.appendChild(section);
  });
}

// ---------- Carrito / barra inferior ----------
function cartTotals() {
  let count = 0;
  let total = 0;
  const priceByName = {};
  MENU.forEach((cat) => cat.items.forEach((i) => (priceByName[i.name] = i.price)));

  Object.entries(cart).forEach(([name, qty]) => {
    count += qty;
    total += qty * priceByName[name];
  });
  return { count, total };
}

function updateCartBar() {
  const bar = document.getElementById("cart-bar");
  const { count, total } = cartTotals();
  if (count === 0) {
    bar.classList.remove("visible");
    return;
  }
  bar.classList.add("visible");
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);
  renderShipLine();
}

function buildWhatsAppMessage() {
  const { total } = cartTotals();
  const lines = [`Hola KIMSA! Quisiera hacer este pedido:`];
  Object.entries(cart).forEach(([name, qty]) => {
    lines.push(`- ${qty}x ${name}`);
  });
  if (Object.keys(cart).length > 0) {
    lines.push("");
    lines.push(`Productos: ${money(total)}`);
    if (envio && envio.tarifa != null) {
      lines.push(`Envío (${envio.zona.nombre}): ${money(envio.tarifa)}`);
      lines.push(`Total aprox: ${money(total + envio.tarifa)}`);
    } else {
      lines.push(`Envío: por confirmar`);
      lines.push(`Total aprox: ${money(total)} + envío`);
    }
  }

  const addressEl = document.getElementById("delivery-address");
  const districtEl = document.getElementById("delivery-district");
  const address = addressEl ? addressEl.value.trim() : "";
  const district = districtEl ? districtEl.value : "";

  lines.push("");
  lines.push(`Dirección de entrega: ${address || "(escribir aquí)"}`);
  lines.push(`Distrito: ${district || "(seleccionar)"}`);

  // Ubicación del cliente y sucursal sugerida (la más cercana dentro de la zona de reparto).
  if (envio) {
    lines.push(`Ubicación: https://www.google.com/maps?q=${envio.lat.toFixed(6)},${envio.lng.toFixed(6)}`);
    if (envio.zona && envio.sucursal) lines.push(`S:${envio.sucursal.id.toUpperCase()}`);
  }

  return lines.join("\n");
}

function populateDeliveryDistricts() {
  const select = document.getElementById("delivery-district");
  if (!select) return;
  DISTRICTS.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    select.appendChild(opt);
  });
}

function trackWhatsappClick(origin) {
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "WhatsApp",
      event_label: origin,
      // Solo si compartió ubicación, nunca las coordenadas.
      has_location: Boolean(envio),
    });
  }
}

function whatsappLink(message) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function wireWhatsappButtons() {
  document.querySelectorAll("[data-wsp-generic]").forEach((btn) => {
    btn.href = whatsappLink(`Hola KIMSA! Quisiera hacer una consulta / pedido.`);
    btn.addEventListener("click", () => trackWhatsappClick(btn.dataset.wspGeneric || "generic"));
  });

  document.getElementById("cart-wsp-btn").addEventListener("click", (e) => {
    const msg = buildWhatsAppMessage();
    window.open(whatsappLink(msg), "_blank", "noopener");
    trackWhatsappClick("cart");
  });
}

// ---------- Envío: ubicación del cliente, zona y tarifa ----------
// La ubicación NO se guarda ni se manda a Analytics ni a ningún servidor: solo
// viaja dentro del mensaje de WhatsApp que el cliente decide enviar.
// Dos formas de darla: permiso del navegador "solo esta vez" o tocar el mapa.
let zonasPromise = null;

function cargarZonas() {
  if (!zonasPromise) {
    zonasPromise = fetch("data/zonas-envio.geojson")
      .then((r) => {
        if (!r.ok) throw new Error("zonas");
        return r.json();
      })
      .then((g) => g.features)
      .catch((e) => {
        zonasPromise = null; // que se pueda reintentar
        throw e;
      });
  }
  return zonasPromise;
}

async function cotizarUbicacion(lat, lng, metodo) {
  const zonas = await cargarZonas();
  return { ...cotizarEnvio(lat, lng, zonas, BRANCHES), metodo };
}

function trackEnvio(params) {
  if (typeof gtag === "function") gtag("event", "shipping_quote", params);
}

function textoEnvio(e) {
  if (e.zona && e.tarifa != null) {
    const suc = e.sucursal ? ` · Sucursal más cercana: ${e.sucursal.nombre}` : "";
    return `✅ Envío a ${e.zona.nombre}: ${money(e.tarifa)}${suc}`;
  }
  if (e.zona) return `📍 ${e.zona.nombre}: el asesor te confirma el costo del envío.`;
  return "📍 Estás fuera de nuestras zonas habituales: el asesor te confirma si llegamos y el costo.";
}

function renderShipLine() {
  const line = document.getElementById("cart-ship-line");
  if (!line) return;
  if (!envio) line.textContent = "";
  else if (envio.tarifa != null) line.textContent = ` + envío ${money(envio.tarifa)}`;
  else line.textContent = " + envío por confirmar";
}

function aplicarEnvio(e, extra = "") {
  envio = e;
  document.getElementById("ship-result").textContent = textoEnvio(e) + extra;
  // Ya con ubicación, se esconden las instrucciones y los botones para que la barra ocupe menos en el celular.
  document.querySelector(".cart-ship").classList.add("ship-done");
  document.getElementById("ship-change-btn").hidden = false;
  renderShipLine();
  trackEnvio({
    metodo: e.metodo,
    resultado: e.tarifa != null ? "en_zona" : e.zona ? "sin_precio" : "fuera_de_zona",
    sucursal: e.zona && e.sucursal ? e.sucursal.id : "ninguna",
  });
}

function usarMiUbicacion() {
  const out = document.getElementById("ship-result");
  if (!navigator.geolocation) {
    out.textContent = "Tu navegador no permite compartir ubicación. Toca «Elegir en el mapa».";
    return;
  }
  out.textContent = "Buscando tu ubicación…";
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const e = await cotizarUbicacion(pos.coords.latitude, pos.coords.longitude, "gps");
        // En computadora la ubicación suele ser aproximada (cientos de metros).
        const aprox = pos.coords.accuracy > 300 ? " (ubicación aproximada: si no es exacta, elígela en el mapa)" : "";
        aplicarEnvio(e, aprox);
      } catch (err) {
        out.textContent = "No pudimos calcular el envío. Toca «Elegir en el mapa».";
      }
    },
    (err) => {
      const denegado = err.code === 1;
      trackEnvio({ metodo: "gps", resultado: denegado ? "permiso_denegado" : "error" });
      out.textContent = denegado
        ? "No diste permiso, no pasa nada: toca «Elegir en el mapa»."
        : "No pudimos ubicarte. Toca «Elegir en el mapa».";
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

// ---------- Mapa para elegir la ubicación ----------
// Con llave de Google Maps (MAPS.googleKey en menu-data.js, restringida a kimsapizza.com)
// se usa Google; sin llave, o si Google la rechaza o no carga, se usa OpenStreetMap
// (Leaflet, sin llave). Cada proveedor es un "adaptador" con la misma forma:
//   iniciar(elemento, alTocar(lat, lng)) · poner(lat, lng) · ajustar()
// Las librerías solo se descargan cuando el cliente abre el mapa.
const CENTRO_MAPA = { lat: -13.1605, lng: -74.2155 };
let mapaAdaptador = null;
let puntoElegido = null;
let turnoMapa = 0;

function cargarScript(src, extra = {}) {
  return new Promise((ok, fallo) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    Object.assign(s, extra);
    s.onload = ok;
    s.onerror = fallo;
    document.head.appendChild(s);
  });
}

function cargarCss(href, integrity) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = href;
  if (integrity) {
    l.integrity = integrity;
    l.crossOrigin = "";
  }
  document.head.appendChild(l);
}

// OpenStreetMap con Leaflet
async function adaptadorOsm() {
  if (!window.L) {
    cargarCss(
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    );
    await cargarScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", {
      integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
      crossOrigin: "",
    });
  }
  let mapa = null;
  let marcador = null;
  return {
    proveedor: "osm",
    iniciar(el, alTocar) {
      mapa = L.map(el).setView([CENTRO_MAPA.lat, CENTRO_MAPA.lng], 14);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(mapa);
      mapa.on("click", (ev) => alTocar(ev.latlng.lat, ev.latlng.lng));
    },
    poner(lat, lng) {
      if (marcador) marcador.setLatLng([lat, lng]);
      else marcador = L.marker([lat, lng]).addTo(mapa);
    },
    ajustar() {
      mapa.invalidateSize();
    },
  };
}

// Google Maps (Maps JavaScript API)
function adaptadorGoogle(llave) {
  return new Promise((ok, fallo) => {
    const espera = setTimeout(() => fallo(new Error("Google tardó demasiado")), 10000);
    window.__kimsaGmapsListo = () => {
      clearTimeout(espera);
      ok(crear());
    };
    cargarScript(
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(llave)}` +
        `&callback=__kimsaGmapsListo&loading=async&language=es&region=PE`
    ).catch((e) => {
      clearTimeout(espera);
      fallo(e);
    });
  });

  function crear() {
    let mapa = null;
    let marcador = null;
    return {
      proveedor: "google",
      iniciar(el, alTocar) {
        mapa = new google.maps.Map(el, {
          center: CENTRO_MAPA,
          zoom: 14,
          clickableIcons: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy", // un dedo mueve el mapa, sin pedir "usa dos dedos"
        });
        mapa.addListener("click", (ev) => alTocar(ev.latLng.lat(), ev.latLng.lng()));
      },
      poner(lat, lng) {
        const pos = { lat, lng };
        if (marcador) marcador.setPosition(pos);
        else marcador = new google.maps.Marker({ position: pos, map: mapa });
      },
      ajustar() {
        google.maps.event.trigger(mapa, "resize");
      },
    };
  }
}

function cerrarMapa() {
  document.getElementById("ship-modal").hidden = true;
  document.body.classList.remove("ship-open");
}

async function abrirMapa() {
  const modal = document.getElementById("ship-modal");
  const out = document.getElementById("ship-result");
  modal.hidden = false;
  document.body.classList.add("ship-open");

  if (!mapaAdaptador) {
    const el = document.getElementById("ship-map");

    const alTocar = async (lat, lng) => {
      const turno = ++turnoMapa;
      mapaAdaptador.poner(lat, lng);
      const res = document.getElementById("ship-map-result");
      res.textContent = "Calculando…";
      document.getElementById("ship-map-ok").disabled = true;
      try {
        const e = await cotizarUbicacion(lat, lng, "mapa");
        if (turno !== turnoMapa) return; // ya tocó otro punto
        puntoElegido = e;
        res.textContent = textoEnvio(e);
        document.getElementById("ship-map-ok").disabled = false;
      } catch (err) {
        if (turno === turnoMapa) res.textContent = "No pudimos calcular el envío. Intenta de nuevo.";
      }
    };

    const conOsm = async () => {
      el.innerHTML = "";
      mapaAdaptador = await adaptadorOsm();
      mapaAdaptador.iniciar(el, alTocar);
    };

    try {
      if (MAPS.googleKey) {
        // Google avisa aquí si la llave es inválida o no permite este sitio
        // (sucede después de dibujar el mapa): se cambia a OpenStreetMap.
        window.gm_authFailure = () => conOsm().catch(() => {});
        mapaAdaptador = await adaptadorGoogle(MAPS.googleKey);
        mapaAdaptador.iniciar(el, alTocar);
      } else {
        await conOsm();
      }
    } catch (err) {
      try {
        await conOsm();
      } catch (err2) {
        cerrarMapa();
        out.textContent = "No pudimos cargar el mapa. Escribe tu dirección y el asesor te confirma el envío.";
        return;
      }
    }
    if (typeof gtag === "function") gtag("event", "shipping_map_open", { proveedor: mapaAdaptador.proveedor });
  }
  setTimeout(() => mapaAdaptador.ajustar(), 50);
}

function wireEnvio() {
  document.getElementById("ship-geo-btn").addEventListener("click", usarMiUbicacion);
  document.getElementById("ship-map-btn").addEventListener("click", abrirMapa);
  document.getElementById("ship-map-cancel").addEventListener("click", cerrarMapa);
  document.getElementById("ship-change-btn").addEventListener("click", () => {
    document.querySelector(".cart-ship").classList.remove("ship-done");
    document.getElementById("ship-change-btn").hidden = true;
  });
  document.getElementById("ship-map-ok").addEventListener("click", () => {
    if (puntoElegido) aplicarEnvio(puntoElegido);
    cerrarMapa();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarMapa();
  });
}

// ---------- Sucursales ----------
function renderBranches() {
  const wrap = document.getElementById("branches-grid");
  wrap.innerHTML = "";
  BRANCHES.forEach((b) => {
    const card = document.createElement("div");
    card.className = "branch-card";
    // Si tenemos coordenadas exactas (del link de Google Maps de la sucursal), las usamos
    // para un pin preciso; si no, caemos a una búsqueda por dirección de texto.
    const mapSrc =
      b.lat && b.lng
        ? `https://www.google.com/maps?q=${b.lat},${b.lng}&z=17&output=embed`
        : `https://www.google.com/maps?q=${encodeURIComponent(b.mapsQuery)}&output=embed`;
    const externalLink =
      b.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery)}`;
    card.innerHTML = `
      <a href="${externalLink}" target="_blank" rel="noopener">
        <iframe src="${mapSrc}" loading="lazy" title="Mapa ${b.name}"></iframe>
      </a>
      <div class="branch-card-body">
        <h3>${b.name}</h3>
        <p>${b.address}</p>
        ${b.zone ? `<p class="branch-zone">${b.zone}</p>` : ""}
        <p>Tel: <a href="tel:+${BUSINESS.whatsappNumber}">${b.phoneDisplay}</a></p>
        <p>Horario: ${BUSINESS.openingHours}</p>
        <a href="${externalLink}" target="_blank" rel="noopener" class="branch-map-link">Ver en Google Maps</a>
      </div>
    `;
    wrap.appendChild(card);
  });
}

// ---------- Zona de cobertura ----------
function renderDistricts() {
  const list = document.getElementById("districts-list");
  list.innerHTML = DISTRICTS.map((d) => `<li>${d}</li>`).join("");
}

// ---------- JSON-LD dinámico (generado desde MENU / BRANCHES) ----------
function injectStructuredData() {
  const graph = [];

  BRANCHES.forEach((b) => {
    graph.push({
      "@type": "Restaurant",
      name: `${BUSINESS.name} - ${b.name.replace("KIMSA ", "")}`,
      image: "https://kimsapizza.com/assets/og/og-image.jpg",
      url: "https://kimsapizza.com/",
      // Solo se declaran las redes propias. Si están vacías, se omite el campo.
      ...(SOCIAL.facebook || SOCIAL.instagram
        ? { sameAs: [SOCIAL.facebook, SOCIAL.instagram].filter(Boolean) }
        : {}),
      servesCuisine: BUSINESS.cuisines,
      priceRange: BUSINESS.priceRange,
      telephone: `+${BUSINESS.whatsappNumber}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.address,
        addressLocality: "Ayacucho",
        addressRegion: "Ayacucho",
        postalCode: "05001",
        addressCountry: "PE",
      },
      ...(b.lat && b.lng
        ? { geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng } }
        : {}),
      areaServed: DISTRICTS,
      openingHoursSpecification: BUSINESS.openingHoursSchema.map((spec) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
        ],
        opens: "18:00",
        closes: "23:00",
      })),
      hasMenu: {
        "@type": "Menu",
        hasMenuSection: MENU.map((cat) => ({
          "@type": "MenuSection",
          name: cat.category,
          hasMenuItem: cat.items.map((item) => ({
            "@type": "MenuItem",
            name: item.name,
            description: item.desc || undefined,
            offers: {
              "@type": "Offer",
              price: item.price,
              priceCurrency: "PEN",
            },
          })),
        })),
      },
    });
  });

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(script);
}

// ---------- Video: reproducir automáticamente al pasar por la sección ----------
// Ningún navegador permite arrancar un video CON sonido sin que el usuario haya
// interactuado antes con la página; es una regla del navegador, no algo que se
// pueda desactivar. Por eso el video arranca silenciado (que sí está permitido) y
// el usuario activa el audio con el control de volumen del propio video.
// Una vez que lo hace, se respeta su elección y no se vuelve a silenciar.
function wireVideoAutoplay() {
  const video = document.getElementById("feature-video");
  if (!video) return;

  let userWantsSound = false;

  video.addEventListener("volumechange", () => {
    if (!video.muted && video.volume > 0) userWantsSound = true;
  });

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Solo forzar el silencio si el usuario todavía no pidió sonido.
          if (!userWantsSound) video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(video);
}

// ---------- Menú móvil (hamburguesa) ----------
function wireNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  // Al tocar cualquier enlace, el menú se cierra solo
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar al tocar fuera del header
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  // Si se agranda la ventana a escritorio, limpiar el estado
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  renderBranches();
  renderDistricts();
  populateDeliveryDistricts();
  wireWhatsappButtons();
  wireEnvio();
  wireVideoAutoplay();
  wireNavToggle();
  injectStructuredData();
  document.getElementById("year").textContent = new Date().getFullYear();
});
