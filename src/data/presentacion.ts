/* Contenido tomado de la presentación del Figma (slides 02 a 07) */

export const PASOS_ADOPCION = [
  {
    n: "01",
    titulo: "Encontrar",
    texto: "Catálogo de perros y gatos de la ciudad, con filtros por especie, tamaño y edad.",
  },
  {
    n: "02",
    titulo: "Conocer",
    texto: "Ficha completa: salud, vacunas, castración, temperamento y refugio.",
  },
  {
    n: "03",
    titulo: "Adoptar",
    texto: "Solicitud guiada en 3 pasos y seguimiento del estado desde la app.",
  },
];

export const PROBLEMAS = [
  {
    n: "01",
    titulo: "Información dispersa",
    texto: "Las publicaciones están repartidas entre grupos de Facebook, Instagram y WhatsApp, y se pierden en el día.",
  },
  {
    n: "02",
    titulo: "Datos incompletos",
    texto: "Muchas veces no se sabe si está vacunado, castrado o cómo se lleva con chicos y otros animales.",
  },
  {
    n: "03",
    titulo: "Sin seguimiento",
    texto: "Mandás un mensaje y no sabés si lo leyeron ni en qué quedó tu consulta.",
  },
  {
    n: "04",
    titulo: "Difícil encontrar refugios",
    texto: "No hay un lugar que muestre qué refugios hay cerca, sus horarios y sus animales.",
  },
];

export type Valor = "si" | "no" | "parcial";

export const COMPARATIVA: { caracteristica: string; redes: Valor; apps: Valor; adoptapp: Valor }[] = [
  { caracteristica: "Pensada solo para adopción responsable", redes: "no", apps: "parcial", adoptapp: "si" },
  { caracteristica: "Local: refugios y barrios de Río Cuarto", redes: "parcial", apps: "no", adoptapp: "si" },
  { caracteristica: "Ficha completa: salud, vacunas y carácter", redes: "no", apps: "parcial", adoptapp: "si" },
  { caracteristica: "Solicitud guiada en 3 pasos", redes: "no", apps: "no", adoptapp: "si" },
  { caracteristica: "Seguimiento del estado de tu solicitud", redes: "no", apps: "no", adoptapp: "si" },
  { caracteristica: "Mapa de refugios con horarios", redes: "no", apps: "parcial", adoptapp: "si" },
  { caracteristica: "Accesible y con modo oscuro", redes: "parcial", apps: "parcial", adoptapp: "si" },
];

export const PUBLICOS = [
  {
    titulo: "Quien quiere adoptar",
    texto: "Busca un compañero, quiere saber todo antes de decidir y seguir su solicitud sin llamar cinco veces.",
    foto: "/img/historias/abrazo.jpg",
    alt: "Joven abrazando a un perro dorado al aire libre",
    cta: { texto: "Ver mascotas", href: "/#mascotas" },
  },
  {
    titulo: "Refugios y rescatistas",
    texto: "Necesitan mostrar a sus animales, recibir solicitudes ordenadas y encontrar hogares responsables.",
    foto: "/img/varios/voluntaria.jpg",
    alt: "Persona acariciando a un perro golden en una casa",
    cta: { texto: "Sumar tu refugio", href: "/sumar-refugio" },
  },
  {
    titulo: "Quien necesita dar en adopción",
    texto: "Encontró un animal o no puede seguir cuidándolo y quiere publicarlo de forma segura.",
    foto: "/img/varios/transito.jpg",
    alt: "Perro marrón envuelto en una toalla rosa mientras lo secan",
    cta: { texto: "Dar en adopción", href: "/dar-en-adopcion" },
  },
];

export const FUNCIONALIDADES = [
  { titulo: "Catálogo con filtros", texto: "Especie, tamaño, edad y sexo, con chips rápidos." },
  { titulo: "Ficha de cada mascota", texto: "Galería, salud, temperamento y datos del refugio." },
  { titulo: "Favoritos", texto: "Guardá las que te gustan para pensarlo con calma." },
  { titulo: "Solicitud en 3 pasos", texto: "Tus datos, tu hogar y confirmación, con progreso visible." },
  { titulo: "Mis solicitudes", texto: "Estado en revisión, aprobada o rechazada, con color, ícono y texto." },
  { titulo: "Dar en adopción", texto: "Formulario con validación y aviso de éxito." },
  { titulo: "Mapa de refugios", texto: "Refugios cercanos, horarios y cómo llegar." },
  { titulo: "Ajustes y accesibilidad", texto: "Modo oscuro, notificaciones y reducir movimiento." },
];

export const PROCESO = [
  { n: "1", titulo: "Consigna e ideas", texto: "Qué problema resolvemos y para quién." },
  { n: "2", titulo: "Baja fidelidad", texto: "Wireframes en grises: estructura, jerarquía y flujos." },
  { n: "3", titulo: "Sistema de diseño", texto: "Colores, tipografía, componentes con 5 estados." },
  { n: "4", titulo: "Alta fidelidad", texto: "Pantallas finales con fotos, marca y modo oscuro." },
  { n: "5", titulo: "Prototipo", texto: "Flujos navegables con animaciones." },
  { n: "6", titulo: "Página web", texto: "La versión funcionando que estás mirando." },
];

export const ONBOARDING = [
  {
    titulo: "Encontrá a tu compañero",
    texto: "Perros y gatos de refugios y rescatistas de Río Cuarto, en un solo lugar.",
    foto: "/img/hero/hero-1.jpg",
    alt: "Dos perros corriendo por un camino de tierra al atardecer",
  },
  {
    titulo: "Adoptá con información clara",
    texto: "Mirá vacunas, castración y temperamento antes de decidir.",
    foto: "/img/mascotas/lola.jpg",
    alt: "Perra mestiza color miel, sonriendo con la lengua afuera",
  },
  {
    titulo: "Te acompañamos en todo el proceso",
    texto: "Completá la solicitud en 3 pasos y seguí su estado desde la app.",
    foto: "/img/historias/pareja.jpg",
    alt: "Pareja sonriendo con su perro adoptado",
  },
];
