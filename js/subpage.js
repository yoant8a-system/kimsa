// ============================================================
// Script liviano para las subpáginas.
// Solo lo necesario: botones de WhatsApp, menú móvil y año del pie.
// La lógica del carrito vive en script.js y solo la usa la portada.
// ============================================================

function whatsappLink(message) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function trackWhatsappClick(origin) {
  if (typeof gtag === "function") {
    gtag("event", "generate_lead", {
      event_category: "WhatsApp",
      event_label: origin,
    });
  }
}

function wireWhatsappButtons() {
  document.querySelectorAll("[data-wsp-generic]").forEach((btn) => {
    const origin = btn.dataset.wspGeneric || "generic";
    // Cada página manda un mensaje distinto para saber de dónde vino el pedido
    const msg = btn.dataset.wspMsg || "Hola KIMSA! Quisiera hacer una consulta / pedido.";
    btn.href = whatsappLink(msg);
    btn.addEventListener("click", () => trackWhatsappClick(origin));
  });
}

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

  nav.querySelectorAll("a").forEach((l) => l.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireWhatsappButtons();
  wireNavToggle();
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
