// ============================================================
// Cálculo de envío - KIMSA Pizzas
// Dada la ubicación del cliente (lat/lng) devuelve su zona de
// reparto, la tarifa de envío y la sucursal más cercana.
// Son funciones puras (sin DOM) para poder probarlas con node.
// ============================================================

// Punto dentro de un polígono GeoJSON (anillo exterior + huecos), regla par-impar.
function puntoEnPoligono(lng, lat, anillos) {
  let dentro = false;
  for (const anillo of anillos) {
    let j = anillo.length - 1;
    for (let i = 0; i < anillo.length; i++) {
      const [xi, yi] = anillo[i];
      const [xj, yj] = anillo[j];
      if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        dentro = !dentro;
      }
      j = i;
    }
  }
  return dentro;
}

// Zonas (features de GeoJSON) que contienen el punto.
function zonasQueContienen(lat, lng, zonas) {
  return zonas.filter((z) => {
    const g = z.geometry;
    if (!g) return false;
    if (g.type === "Polygon") return puntoEnPoligono(lng, lat, g.coordinates);
    if (g.type === "MultiPolygon") return g.coordinates.some((p) => puntoEnPoligono(lng, lat, p));
    return false;
  });
}

// Área aproximada (shoelace, solo para comparar zonas entre sí).
function areaAnillo(anillo) {
  let s = 0;
  for (let i = 0, j = anillo.length - 1; i < anillo.length; j = i++) {
    s += anillo[j][0] * anillo[i][1] - anillo[i][0] * anillo[j][1];
  }
  return Math.abs(s / 2);
}

function areaZona(z) {
  const g = z.geometry;
  const polis = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  return polis.reduce((t, p) => t + areaAnillo(p[0]), 0);
}

// Si dos zonas se solapan, manda la más pequeña (la más específica).
function buscarZona(lat, lng, zonas) {
  const hits = zonasQueContienen(lat, lng, zonas);
  if (hits.length === 0) return null;
  hits.sort((a, b) => areaZona(a) - areaZona(b));
  return hits[0];
}

// "olivos3" -> "Olivos 3", "parque_infantil" -> "Parque infantil"
function nombreZona(idZona) {
  const s = String(idZona || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/([a-zA-ZñÑ])(\d+)$/, "$1 $2")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function sucursalMasCercana(lat, lng, sucursales) {
  let mejor = null;
  for (const s of sucursales) {
    if (typeof s.lat !== "number" || typeof s.lng !== "number") continue;
    const km = distanciaKm(lat, lng, s.lat, s.lng);
    if (!mejor || km < mejor.km) mejor = { id: s.id, nombre: s.name, km };
  }
  return mejor;
}

// Resultado completo para una ubicación.
// tarifa === null -> fuera de zona o zona sin precio: el asesor lo confirma.
function cotizarEnvio(lat, lng, zonas, sucursales) {
  const z = buscarZona(lat, lng, zonas);
  const tarifa = z && typeof z.properties.tarifa === "number" ? z.properties.tarifa : null;
  return {
    lat,
    lng,
    zona: z ? { id: z.properties.id_zona, nombre: nombreZona(z.properties.id_zona) } : null,
    tarifa,
    sucursal: sucursalMasCercana(lat, lng, sucursales),
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    puntoEnPoligono,
    zonasQueContienen,
    buscarZona,
    nombreZona,
    distanciaKm,
    sucursalMasCercana,
    cotizarEnvio,
  };
}
