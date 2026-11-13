/* Guía para adoptar: checklist, test de compatibilidad, costos y primeros días */

export const CHECKLIST = [
  "Todas las personas de la casa están de acuerdo",
  "Tengo tiempo para paseos, juego y cuidado todos los días",
  "Puedo cubrir alimento, vacunas y veterinario",
  "Mi vivienda permite mascotas (o tengo permiso)",
  "Sé quién lo cuida si me voy de viaje",
  "Tengo un espacio seguro (ventanas con red, patio cerrado)",
  "Estoy dispuesto/a a esperar su adaptación",
  "Pienso en un compromiso de 10 a 15 años",
];

export type Respuestas = {
  vivienda: "depto" | "casa" | "patio";
  tiempo: "poco" | "medio" | "mucho";
  chicos: "si" | "no";
  otros: "no" | "perro" | "gato";
  especie: "perro" | "gato" | "igual";
};

export const PREGUNTAS_TEST: {
  id: keyof Respuestas;
  pregunta: string;
  opciones: { valor: string; texto: string }[];
}[] = [
  {
    id: "vivienda",
    pregunta: "¿Dónde vivís?",
    opciones: [
      { valor: "depto", texto: "Departamento" },
      { valor: "casa", texto: "Casa sin patio" },
      { valor: "patio", texto: "Casa con patio" },
    ],
  },
  {
    id: "tiempo",
    pregunta: "¿Cuánto tiempo libre tenés por día?",
    opciones: [
      { valor: "poco", texto: "Poco (menos de 1 h)" },
      { valor: "medio", texto: "Medio (1 a 3 h)" },
      { valor: "mucho", texto: "Mucho (más de 3 h)" },
    ],
  },
  {
    id: "chicos",
    pregunta: "¿Hay chicos en la casa?",
    opciones: [
      { valor: "si", texto: "Sí" },
      { valor: "no", texto: "No" },
    ],
  },
  {
    id: "otros",
    pregunta: "¿Convivís con otros animales?",
    opciones: [
      { valor: "no", texto: "No" },
      { valor: "perro", texto: "Con un perro" },
      { valor: "gato", texto: "Con un gato" },
    ],
  },
  {
    id: "especie",
    pregunta: "¿Qué te imaginás?",
    opciones: [
      { valor: "perro", texto: "Un perro" },
      { valor: "gato", texto: "Un gato" },
      { valor: "igual", texto: "Me da igual" },
    ],
  },
];

/* Valores de ejemplo en pesos argentinos: actualizalos con precios reales de tu zona */
export const COSTOS = {
  alimento: { gato: 22000, pequeno: 25000, mediano: 40000, grande: 60000 },
  higiene: { gato: 9000, perro: 4000 },
  antiparasitarios: 6000,
  veterinaria: 8000,
  extras: [
    { id: "peluqueria", texto: "Peluquería", valor: 15000 },
    { id: "paseador", texto: "Paseador o guardería", valor: 30000 },
    { id: "juguetes", texto: "Juguetes y accesorios", valor: 5000 },
    { id: "seguro", texto: "Plan de salud veterinario", valor: 12000 },
  ],
};

export const PREPARAR_CASA = {
  perros: [
    "Cama o manta en un rincón tranquilo",
    "Platos para agua y comida",
    "Correa, pechera y chapita con tu teléfono",
    "Patio o balcón cerrado y seguro",
    "Juguetes para morder",
  ],
  gatos: [
    "Redes en ventanas y balcones",
    "Bandeja sanitaria y piedritas",
    "Rascador alto",
    "Transportadora para el veterinario",
    "Escondites: cajas o cuevitas",
  ],
};

export const PRIMEROS_DIAS = [
  { cuando: "Día 1", titulo: "Llegada tranquila", texto: "Mostrale su lugar, agua y comida. Pocas visitas y mucha paciencia." },
  { cuando: "Primera semana", titulo: "Rutinas", texto: "Horarios fijos de comida y paseo. Presentá a otras mascotas de a poco." },
  { cuando: "Primer mes", titulo: "Confianza", texto: "Visita al veterinario, refuerzo positivo y paseos por zonas nuevas." },
  { cuando: "Seguimiento", titulo: "No estás solo/a", texto: "El refugio te llama para ver cómo van. Consultá todo lo que necesites." },
];
