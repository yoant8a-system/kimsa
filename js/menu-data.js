// ============================================================
// DATOS DEL NEGOCIO - KIMSA Pizzas
// Fuente única de verdad: se usa tanto para pintar el menú
// como para generar el JSON-LD (datos estructurados) de forma
// automática. Si cambias un precio o agregas un plato, se
// refleja en toda la página.
// ============================================================

const BUSINESS = {
  // El nombre debe coincidir EXACTAMENTE con el de la ficha de Google y Facebook.
  // Si el sitio se llama distinto, Google no asocia la web con el negocio que ya
  // conoce (el de las 65 reseñas) y ambos compiten en vez de reforzarse.
  name: "KIMSA Pizza & Pasta",
  legalName: "KIMSA Pizza & Pasta",
  description:
    "Pizzería en Ayacucho especializada en pizzas artesanales, pastas y alitas, con delivery a todo Huamanga y distritos aledaños.",
  whatsappNumber: "51967414558", // formato internacional sin '+' ni espacios
  whatsappDisplay: "967 414 558",
  // Confirmado por el dueño: 6pm a 11pm todos los días en SUS tres locales.
  // (En la ficha de Google de otras sucursales KIMSA figura 4pm-11pm, pero esas
  // no son de este cliente.)
  openingHours: "18:00-23:00",
  openingHoursSchema: ["Mo-Su 18:00-23:00"],
  priceRange: "S/ 7 - S/ 70",
  cuisines: ["Pizza", "Pasta", "Comida Italiana", "Alitas"],
};

// Perfiles oficiales. Se usan para enlazarlos desde el sitio y, sobre todo, para
// declararlos en el JSON-LD como "sameAs": así Google entiende que la web, la
// página de Facebook y la ficha de Google son el mismo negocio.
const SOCIAL = {
  facebook: "https://www.facebook.com/KimsaPizza/",
  instagram: "https://www.instagram.com/kimsa.pizza/",
};

// Distritos y zonas de reparto en Ayacucho
const DISTRICTS = [
  "Ayacucho (Cercado)",
  "Andrés Avelino Cáceres Dorregaray",
  "Carmen Alto",
  "Jesús Nazareno",
  "San Juan Bautista",
  "Yanama",
  "Yanamilla",
  "San José",
  "Vía Los Libertadores",
];

// Sucursales - mismo número de WhatsApp para las 3, el asesor
// define la sucursal más cercana según la dirección del cliente.
const BRANCHES = [
  {
    id: "ejercito",
    name: "KIMSA Av. Ejército",
    address: "Av. Ejército 558 (Frente al Grifo Roca), Ayacucho",
    phoneDisplay: "967 414 558",
    mapsQuery: "Av. Ejército 558, Ayacucho, Perú", // TODO: reemplazar por lat/lng cuando tengamos el link de Google Maps de esta sucursal
    mapsUrl: null,
  },
  {
    id: "olivos",
    name: "KIMSA Los Olivos",
    address: "Av. Los Incas 400 - Los Olivos, Ayacucho",
    phoneDisplay: "967 414 558",
    lat: -13.1701522,
    lng: -74.2160721,
    mapsUrl: "https://www.google.com/maps/place/Kimsa+pizza+%26+pasta-+los+olivos,+San+Juan+bautista/@-13.1697398,-74.2160114,19.46z/data=!4m6!3m5!1s0x91128725a23d9ba9:0x51914432fc8fc201!8m2!3d-13.1701522!4d-74.2160721!16s%2Fg%2F11v_8m31cd",
  },
  {
    id: "nazarenas",
    name: "KIMSA Nazarenas",
    address: "Jr. José Santos Chocano (Frente al Parque Infantil Nazarenas), Ayacucho",
    phoneDisplay: "967 414 558",
    lat: -13.154172,
    lng: -74.21558,
    mapsUrl: "https://maps.app.goo.gl/Bt3ied4MDUpCmWHU9",
  },
];

// Carta completa
const MENU = [
  {
    category: "Piqueos y Entradas",
    items: [
      { name: "Pan al Ajo Simple", price: 7 },
      { name: "Pan al Ajo Especial", price: 10 },
      { name: "Pan al Ajo Kimsa", price: 15 },
      { name: "Porción de Papa", price: 10 },
      { name: "Salchipapa", price: 12 },
      { name: "Salchipapa Kimsa", price: 17 },
      { name: "Tequeños de Queso y/o Jamón", price: 12 },
      { name: "Tequeños Kimsa", price: 20 },
      { name: "Ronda Kimsa", price: 70, desc: "Piqueo combinado para compartir" },
    ],
  },
  {
    category: "Pastas",
    items: [
      { name: "Pasta a lo Alfredo", price: 20 },
      { name: "Pasta a la Carbonara", price: 22 },
      { name: "Pasta a la Boloñesa", price: 23 },
      { name: "Lasagna", price: 25 },
      { name: "Pasta a la Huancaína con Lomo / Filete de Pollo", price: 29 },
      { name: "Pasta al Pesto con Lomo / Filete de Pollo", price: 29 },
    ],
  },
  {
    category: "Alitas",
    items: [
      { name: "Alitas Clásicas", price: 22 },
      { name: "Alitas de Dragón", price: 25 },
      { name: "Alitas Acevichadas", price: 28 },
      { name: "Alitas BBQ", price: 28 },
      { name: "Alitas Búfalo", price: 28 },
      { name: "Alitas en Salsa de Maracuyá", price: 28 },
    ],
  },
  {
    category: "Pizzas Familiares",
    items: [
      {
        name: "Pizza Americana Familiar",
        desc: "Mozarela, jamón suizo, aceituna verde y negra, pimentón",
        price: 30,
      },
      {
        name: "Pizza Peperoni Familiar",
        desc: "Mozarela, peperoni, jamón suizo",
        price: 34,
      },
      {
        name: "Pizza Española Familiar",
        desc: "Mozarela, chorizo, jamón suizo, hojitas de albahaca",
        price: 34,
      },
      {
        name: "Pizza Hawaiana 1 Familiar",
        desc: "Mozarela, piña golden, jamón suizo",
        price: 34,
      },
      {
        name: "Pizza Italiana Familiar",
        desc: "Mozarela, cabanosi, champiñones, pimentón",
        price: 34,
      },
      {
        name: "Pizza Hawaiana 2 Familiar",
        desc: "Mozarela, piña golden, durazno, jamón suizo",
        price: 35,
      },
      {
        name: "Pizza Vegetariana Familiar",
        desc: "Mozarela, aros de cebolla blanca, champiñones, aceitunas, aros de tomate, pimentón",
        price: 36,
      },
      {
        name: "Pizza Hawaiana Chicken Familiar",
        desc: "Mozarela, piña golden, durazno, jamón suizo, pollo deshilachado",
        price: 37,
      },
      {
        name: "Pizza Hawaiana 3 Familiar",
        desc: "Mozarela, piña golden, durazno, tocino, jamón suizo",
        price: 39,
      },
      {
        name: "Pizza Kimsa Clásica Familiar",
        desc: "Mozarela, carne molida, pollo deshilachado, tocino, champiñones, chorizo, jamón suizo, salame, aceitunas, pimentón",
        price: 42,
      },
      {
        name: "Pizza Kimsa Especial Familiar",
        desc: "Mozarela, carne molida, pollo deshilachado, tocino, champiñones, chorizo, jamón suizo, salame, aceitunas, pimentón, lomo",
        price: 45,
      },
      { name: "Pizza Tropical Familiar", price: 45 },
    ],
  },
  {
    category: "Pizzas Medianas",
    items: [
      { name: "Pizza Americana Mediana", price: 18 },
      { name: "Pizza Española Mediana", price: 19 },
      { name: "Pizza Hawaiana 1 Mediana", price: 19 },
      { name: "Pizza Italiana Mediana", price: 19 },
      { name: "Pizza Peperoni Mediana", price: 19 },
      { name: "Pizza Vegetariana Mediana", price: 19 },
      { name: "Pizza Hawaiana 2 Mediana", price: 20 },
      { name: "Pizza Hawaiana Chicken Mediana", price: 21 },
      { name: "Pizza Hawaiana 3 Mediana", price: 22 },
      { name: "Pizza Kimsa Clásica Mediana", price: 25 },
      { name: "Pizza Tropical Mediana", price: 28 },
      { name: "Pizza Kimsa Especial Mediana", price: 28 },
    ],
  },
  {
    category: "Promociones",
    items: [
      {
        name: "Promo 2 x S/ 60",
        desc: "Escoge entre: Americana, Peperoni, Hawaiana 1 (máximo una pizza por sabor)",
        price: 60,
      },
    ],
  },
];
