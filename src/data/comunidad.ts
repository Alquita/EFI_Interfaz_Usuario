/* Contenido de las secciones de comunidad: voluntariado, donaciones y apadrinamiento (datos de ejemplo) */

export const ROLES_VOLUNTARIADO = [
  {
    id: "paseos",
    titulo: "Paseos",
    texto: "Sacá a pasear a los perros del refugio los fines de semana. Son su mejor momento.",
    tiempo: "2 h por semana",
    icono: "footprints",
  },
  {
    id: "fotos",
    titulo: "Fotografía",
    texto: "Una buena foto cambia todo. Ayudanos a retratar a cada animal para su ficha.",
    tiempo: "1 sábado al mes",
    icono: "camera",
  },
  {
    id: "traslados",
    titulo: "Traslados",
    texto: "Llevá animales al veterinario o a su nuevo hogar con tu auto.",
    tiempo: "Cuando puedas",
    icono: "car",
  },
  {
    id: "eventos",
    titulo: "Jornadas y ferias",
    texto: "Armá stands, recibí a las familias y contá cómo funciona la adopción.",
    tiempo: "Fechas puntuales",
    icono: "party",
  },
  {
    id: "redes",
    titulo: "Difusión",
    texto: "Escribí textos, compartí publicaciones y ayudanos a llegar a más familias.",
    tiempo: "Desde tu casa",
    icono: "megaphone",
  },
  {
    id: "limpieza",
    titulo: "Cuidado diario",
    texto: "Limpieza, comida y mimos. El trabajo de todos los días que más se necesita.",
    tiempo: "3 h por semana",
    icono: "heart",
  },
] as const;

export const MONTOS_DONACION = [2000, 5000, 10000, 20000];

export const DESTINOS_DONACION = [
  { id: "castraciones", titulo: "Castraciones", texto: "Cada castración evita camadas que terminan en la calle.", icono: "scissors" },
  { id: "veterinaria", titulo: "Vacunas y veterinaria", texto: "Consultas, análisis y tratamientos de los rescatados.", icono: "stethoscope" },
  { id: "alimento", titulo: "Alimento", texto: "Balanceado de calidad para cachorros, adultos y seniors.", icono: "package" },
] as const;

/* Mascotas para apadrinar: las que más tardan en encontrar hogar */
export const APADRINABLES = ["bruno", "nieve", "negra", "pancho"];

export const DATOS_TRANSFERENCIA = {
  titular: "AdoptApp Río Cuarto (ejemplo)",
  alias: "ADOPTAPP.HUELLAS.RC",
  cbu: "0000003100099999999999",
};
