// ============================================================
// KIMSA Pizzas - lógica de la página
// Usa los datos de menu-data.js como única fuente de verdad
// para: pintar el menú, armar el mensaje de WhatsApp y generar
// el JSON-LD del menú (SEO / rich results).
// ============================================================

const cart = {}; // { "Nombre del plato": qty }

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
}

function buildWhatsAppMessage() {
  const { total } = cartTotals();
  const lines = [`Hola KIMSA! Quisiera hacer este pedido:`];
  Object.entries(cart).forEach(([name, qty]) => {
    lines.push(`- ${qty}x ${name}`);
  });
  if (Object.keys(cart).length > 0) {
    lines.push("");
    lines.push(`Total aprox: ${money(total)}`);
  }

  const addressEl = document.getElementById("delivery-address");
  const districtEl = document.getElementById("delivery-district");
  const address = addressEl ? addressEl.value.trim() : "";
  const district = districtEl ? districtEl.value : "";

  lines.push("");
  lines.push(`Dirección de entrega: ${address || "(escribir aquí)"}`);
  lines.push(`Distrito: ${district || "(seleccionar)"}`);

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
  // TODO: reemplazar por el ID real de Google Analytics 4 (ver <head>)
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "WhatsApp",
      event_label: origin,
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
      servesCuisine: BUSINESS.cuisines,
      priceRange: BUSINESS.priceRange,
      telephone: `+${BUSINESS.whatsappNumber}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: b.address,
        addressLocality: "Ayacucho",
        addressRegion: "Ayacucho",
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
// se muestra un botón "Activar sonido": ese clic es la interacción que el navegador
// exige. Una vez que el usuario pide sonido, se respeta y no se vuelve a silenciar.
function wireVideoAutoplay() {
  const video = document.getElementById("feature-video");
  const soundBtn = document.getElementById("video-sound-btn");
  if (!video) return;

  let userWantsSound = false;

  const enableSound = () => {
    userWantsSound = true;
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {});
    if (soundBtn) soundBtn.hidden = true;
  };

  if (soundBtn) soundBtn.addEventListener("click", enableSound);

  // Si el usuario activa el sonido desde los controles del propio video,
  // tomarlo como su preferencia y esconder el botón.
  video.addEventListener("volumechange", () => {
    if (!video.muted && video.volume > 0) {
      userWantsSound = true;
      if (soundBtn) soundBtn.hidden = true;
    }
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
  wireVideoAutoplay();
  wireNavToggle();
  injectStructuredData();
  document.getElementById("year").textContent = new Date().getFullYear();
});
