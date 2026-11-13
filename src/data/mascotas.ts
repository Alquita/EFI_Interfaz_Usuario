/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { Mascota } from "@/types";

/* edadMeses define la etapa: cachorro (< 12), joven (12–35), adulto (36–95), mayor (96+) */
export const MASCOTAS: Mascota[] = [
  {
    id: "lola", nombre: "Lola", especie: "perro", sexo: "hembra", edadMeses: 36, edad: "3 años", tamano: "mediano",
    tipo: "Perra mestiza", peso: "14 kg", barrio: "Alberdi", refugio: "huellitas", distancia: 1.2, estado: "disponible", publicado: "2026-11-02",
    foto: "/img/mascotas/lola.jpg", alt: "Perra mestiza color miel, sonriendo con la lengua afuera",
    salud: ["Vacunada", "Castrada", "Desparasitada", "Con chip"], castrado: true,
    saludTexto: "Tiene sus vacunas al día y control veterinario reciente en el refugio.",
    temperamento: "Lola es tranquila en casa y muy cariñosa con las personas. Disfruta los paseos largos y se lleva bien con otros perros. Con gatos todavía no la probamos.",
    rasgos: ["Tranquila", "Cariñosa", "Paseadora"], convive: { perros: true, gatos: null, chicos: true }
  },
  {
    id: "mora", nombre: "Mora", especie: "gato", sexo: "hembra", edadMeses: 24, edad: "2 años", tamano: "pequeno",
    tipo: "Gata", peso: "3,5 kg", barrio: "Banda Norte", refugio: "gatuno", distancia: 2.8, estado: "disponible", publicado: "2026-11-08",
    foto: "/img/mascotas/mora.jpg", alt: "Gata blanca y negra apoyando las patas en un mueble de madera, con fondo verde",
    salud: ["Vacunada", "Castrada", "Desparasitada", "Test de VIF negativo"], castrado: true,
    saludTexto: "Castrada, vacunada y con test de leucemia e inmunodeficiencia negativo.",
    temperamento: "Mora es curiosa y charlatana: te sigue por la casa y maúlla para pedir mimos. Ideal para un departamento con ventanas protegidas.",
    rasgos: ["Curiosa", "Mimosa", "De interior"], convive: { perros: false, gatos: true, chicos: true }
  },
  {
    id: "toto", nombre: "Toto", especie: "perro", sexo: "macho", edadMeses: 12, edad: "1 año", tamano: "mediano",
    tipo: "Perro mestizo", peso: "12 kg", barrio: "Bimaco", refugio: "huellitas", distancia: 1.9, estado: "disponible", publicado: "2026-11-10",
    foto: "/img/mascotas/toto.jpg", alt: "Perro tricolor de pelo medio, sonriendo en la playa con el mar de fondo",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Sano y con todas las vacunas de cachorro completas.",
    temperamento: "Toto tiene mucha energía y aprende rápido. Busca una familia activa que lo saque a correr y le enseñe trucos. Se lleva bien con chicos grandes.",
    rasgos: ["Juguetón", "Inteligente", "Activo"], convive: { perros: true, gatos: false, chicos: true }
  },
  {
    id: "simon", nombre: "Simón", especie: "gato", sexo: "macho", edadMeses: 8, edad: "8 meses", tamano: "pequeno",
    tipo: "Gato", peso: "3 kg", barrio: "Centro", refugio: "gatuno", distancia: 3.1, estado: "reservado", publicado: "2026-10-05",
    foto: "/img/mascotas/simon.jpg", alt: "Gato atigrado joven mirando hacia arriba con ojos verdes, cielo celeste de fondo",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Castrado a los 6 meses y con la vacuna triple felina.",
    temperamento: "Simón es un torbellino: juega con todo lo que se mueve y después se duerme encima tuyo. Se lleva genial con otros gatos.",
    rasgos: ["Juguetón", "Sociable", "Dormilón"], convive: { perros: null, gatos: true, chicos: true }
  },
  {
    id: "pancho", nombre: "Pancho", especie: "perro", sexo: "macho", edadMeses: 72, edad: "6 años", tamano: "pequeno",
    tipo: "Perro mestizo tipo pug", peso: "8 kg", barrio: "Barrio Golf", refugio: "patitas", distancia: 3.5, estado: "disponible", publicado: "2026-09-20",
    foto: "/img/mascotas/pancho.jpg", alt: "Pug color negro con un abrigo tejido gris, sobre fondo amarillo",
    salud: ["Vacunado", "Castrado", "Control cardíaco"], castrado: true,
    saludTexto: "Por su raza necesita evitar el calor fuerte y las escaleras. Tiene control cardíaco al día.",
    temperamento: "Pancho es un compañero tranquilo que ama el sillón y las siestas. Ronca un poquito. Ideal para personas mayores o casas sin escaleras.",
    rasgos: ["Tranquilo", "Compañero", "Dormilón"], convive: { perros: true, gatos: true, chicos: true }
  },
  {
    id: "nala", nombre: "Nala", especie: "gato", sexo: "hembra", edadMeses: 48, edad: "4 años", tamano: "mediano",
    tipo: "Gata", peso: "4 kg", barrio: "Alberdi", refugio: "gatuno", distancia: 1.4, estado: "disponible", publicado: "2026-10-28",
    foto: "/img/mascotas/nala.jpg", alt: "Gata atigrada sentada en una escalera blanca, mirando a la cámara",
    salud: ["Vacunada", "Castrada", "Desparasitada"], castrado: true,
    saludTexto: "Sana, castrada y con vacunas al día.",
    temperamento: "Nala es independiente pero muy dulce cuando toma confianza. Prefiere casas tranquilas y ser la única gata.",
    rasgos: ["Independiente", "Dulce", "Observadora"], convive: { perros: false, gatos: false, chicos: true }
  },
  {
    id: "coco", nombre: "Coco", especie: "perro", sexo: "macho", edadMeses: 12, edad: "1 año", tamano: "mediano",
    tipo: "Perro mestizo tipo corgi", peso: "11 kg", barrio: "Centro", refugio: "huellitas", distancia: 2.2, estado: "disponible", publicado: "2026-11-11",
    foto: "/img/mascotas/coco.jpg", alt: "Perro tipo corgi color fuego con orejas grandes, sobre fondo naranja",
    salud: ["Vacunado", "Desparasitado"], castrado: false,
    saludTexto: "Tiene turno de castración para fin de mes, incluido en la adopción.",
    temperamento: "Coco es simpático y muy sociable con perros y personas. Le encanta jugar a la pelota y ya hace sus necesidades afuera.",
    rasgos: ["Sociable", "Simpático", "Juguetón"], convive: { perros: true, gatos: null, chicos: true }
  },
  {
    id: "luna", nombre: "Luna", especie: "perro", sexo: "hembra", edadMeses: 4, edad: "4 meses", tamano: "mediano",
    tipo: "Perra mestiza", peso: "6 kg", barrio: "Banda Norte", refugio: "patitas", distancia: 2.6, estado: "disponible", publicado: "2026-11-12",
    foto: "/img/mascotas/luna.jpg", alt: "Cachorra dorada sentada con una flor amarilla en la boca",
    salud: ["Primera vacuna", "Desparasitada"], castrado: false,
    saludTexto: "Tiene la primera dosis de vacunas. La castración se hace a los 6 meses con el refugio.",
    temperamento: "Luna es una cachorra curiosa y mimosa. Va a ser de tamaño mediano. Necesita una familia con tiempo para educarla.",
    rasgos: ["Cachorra", "Mimosa", "Curiosa"], convive: { perros: true, gatos: true, chicos: true }
  },
  {
    id: "kira", nombre: "Kira", especie: "perro", sexo: "hembra", edadMeses: 24, edad: "2 años", tamano: "pequeno",
    tipo: "Perra mestiza", peso: "7 kg", barrio: "Las Quintas", refugio: "patitas", distancia: 4.0, estado: "disponible", publicado: "2026-10-30",
    foto: "/img/mascotas/kira.jpg", alt: "Perra blanca con manchas marrones y negras, orejas caídas, sobre fondo rosa",
    salud: ["Vacunada", "Castrada", "Desparasitada"], castrado: true,
    saludTexto: "Castrada y con vacunas al día.",
    temperamento: "Kira es alegre y un poco tímida al principio. Con paciencia se vuelve tu sombra. Se lleva bien con perros tranquilos.",
    rasgos: ["Alegre", "Tímida al principio", "Fiel"], convive: { perros: true, gatos: false, chicos: null }
  },
  {
    id: "felipe", nombre: "Felipe", especie: "gato", sexo: "macho", edadMeses: 60, edad: "5 años", tamano: "mediano",
    tipo: "Gato de pelo largo", peso: "5 kg", barrio: "Barrio Jardín", refugio: "gatuno", distancia: 3.3, estado: "disponible", publicado: "2026-10-15",
    foto: "/img/mascotas/felipe.jpg", alt: "Gato de pelo largo marrón y blanco, sentado junto a una ventana con cara seria",
    salud: ["Vacunado", "Castrado", "Dieta renal"], castrado: true,
    saludTexto: "Necesita cepillado dos veces por semana y una dieta especial que el refugio te explica.",
    temperamento: "Felipe tiene cara de enojado pero es un pan de Dios. Le gustan las rutinas, la comida a horario y dormir al sol.",
    rasgos: ["Tranquilo", "Rutinario", "Mimoso"], convive: { perros: false, gatos: true, chicos: false }
  },
  {
    id: "copito", nombre: "Copito", especie: "perro", sexo: "macho", edadMeses: 60, edad: "5 años", tamano: "grande",
    tipo: "Perro mestizo tipo samoyedo", peso: "27 kg", barrio: "Villa Dalcar", refugio: "huellitas", distancia: 5.1, estado: "disponible", publicado: "2026-10-22",
    foto: "/img/mascotas/copito.jpg", alt: "Perro grande de pelo blanco y esponjoso, sonriendo al aire libre",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Sano. Por su pelo necesita sombra y agua fresca en verano.",
    temperamento: "Copito es un gigante gentil. Muy paciente con chicos y ruidos. Necesita patio y paseos diarios.",
    rasgos: ["Gentil", "Paciente", "Familiero"], convive: { perros: true, gatos: true, chicos: true }
  },
  {
    id: "tigre", nombre: "Tigre", especie: "gato", sexo: "macho", edadMeses: 36, edad: "3 años", tamano: "mediano",
    tipo: "Gato", peso: "5 kg", barrio: "Centro", refugio: "gatuno", distancia: 2.9, estado: "disponible", publicado: "2026-11-04",
    foto: "/img/mascotas/tigre.jpg", alt: "Gato naranja de pelo largo echado en el piso de madera, mirando hacia arriba",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Sano y castrado.",
    temperamento: "Tigre es aventurero y muy juguetón. Le encantan los rascadores altos y las cañas con plumas.",
    rasgos: ["Aventurero", "Juguetón", "Sociable"], convive: { perros: true, gatos: true, chicos: true }
  },
  {
    id: "rocco", nombre: "Rocco", especie: "perro", sexo: "macho", edadMeses: 48, edad: "4 años", tamano: "mediano",
    tipo: "Perro mestizo", peso: "16 kg", barrio: "Bimaco", refugio: "patitas", distancia: 2.0, estado: "disponible", publicado: "2026-10-18",
    foto: "/img/mascotas/rocco.jpg", alt: "Perro blanco con manchas negras, sonriendo en una vereda",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Vacunas y castración al día.",
    temperamento: "Rocco es educado, camina bien con correa y sabe sentarse y dar la pata. Le gusta ser el único perro de la casa.",
    rasgos: ["Educado", "Leal", "Guardián"], convive: { perros: false, gatos: false, chicos: true }
  },
  {
    id: "negra", nombre: "Negra", especie: "perro", sexo: "hembra", edadMeses: 84, edad: "7 años", tamano: "grande",
    tipo: "Perra mestiza", peso: "21 kg", barrio: "Barrio Jardín", refugio: "huellitas", distancia: 4.4, estado: "disponible", publicado: "2026-09-12",
    foto: "/img/mascotas/negra.jpg", alt: "Perra negra con pecho blanco y orejas paradas, sonriendo",
    salud: ["Vacunada", "Castrada", "Desparasitada"], castrado: true,
    saludTexto: "Sana y castrada. Tiene una pequeña cicatriz en la pata que no le molesta.",
    temperamento: "Negra fue rescatada de la calle y hoy es la más agradecida del refugio. Tranquila, obediente y muy buena con otros perros.",
    rasgos: ["Agradecida", "Obediente", "Tranquila"], convive: { perros: true, gatos: null, chicos: true }
  },
  {
    id: "bruno", nombre: "Bruno", especie: "perro", sexo: "macho", edadMeses: 108, edad: "9 años", tamano: "grande",
    tipo: "Perro mestizo", peso: "29 kg", barrio: "Alberdi", refugio: "huellitas", distancia: 1.1, estado: "disponible", publicado: "2026-08-30",
    foto: "/img/mascotas/bruno.jpg", alt: "Perro grande color dorado parado sobre una roca, con el cielo de fondo",
    salud: ["Vacunado", "Castrado", "Control geriátrico"], castrado: true,
    saludTexto: "Es senior: tiene control geriátrico y toma un suplemento para las articulaciones.",
    temperamento: "Bruno es puro corazón. Ya no corre como antes, pero ama los paseos cortos y acostarse a tus pies. Adoptar un senior es un regalo enorme.",
    rasgos: ["Senior", "Tranquilo", "Cariñoso"], convive: { perros: true, gatos: true, chicos: true }
  },
  {
    id: "mila", nombre: "Mila", especie: "gato", sexo: "hembra", edadMeses: 3, edad: "3 meses", tamano: "pequeno",
    tipo: "Gatita", peso: "1,2 kg", barrio: "Las Quintas", refugio: "gatuno", distancia: 3.8, estado: "disponible", publicado: "2026-11-12",
    foto: "/img/mascotas/mila.jpg", alt: "Gatita atigrada con pecho blanco sentada, mirando a la cámara",
    salud: ["Primera vacuna", "Desparasitada"], castrado: false,
    saludTexto: "Desparasitada y con la primera vacuna. Se castra a los 6 meses.",
    temperamento: "Mila es una bebé muy activa y sociable. Usa la piedrita sin problemas y come alimento balanceado de gatitos.",
    rasgos: ["Bebé", "Activa", "Sociable"], convive: { perros: null, gatos: true, chicos: true }
  },
  {
    id: "nieve", nombre: "Nieve", especie: "gato", sexo: "hembra", edadMeses: 120, edad: "10 años", tamano: "mediano",
    tipo: "Gata", peso: "4,5 kg", barrio: "Centro", refugio: "gatuno", distancia: 3.0, estado: "disponible", publicado: "2026-09-01",
    foto: "/img/mascotas/nieve.jpg", alt: "Gata blanca de pelo largo y ojos claros, recostada sobre fondo celeste",
    salud: ["Vacunada", "Castrada", "Control geriátrico"], castrado: true,
    saludTexto: "Senior sana. Tiene control anual y análisis de sangre recientes.",
    temperamento: "Nieve se quedó sin familia cuando falleció su humana. Es serena, limpia y busca un regazo para pasar sus años dorados.",
    rasgos: ["Senior", "Serena", "De regazo"], convive: { perros: false, gatos: null, chicos: true }
  },
  {
    id: "tano", nombre: "Tano", especie: "perro", sexo: "macho", edadMeses: 60, edad: "5 años", tamano: "grande",
    tipo: "Perro mestizo tipo pitbull", peso: "25 kg", barrio: "Banda Norte", refugio: "patitas", distancia: 2.7, estado: "disponible", publicado: "2026-10-08",
    foto: "/img/mascotas/tano.jpg", alt: "Perro gris tipo pitbull echado al sol con la lengua afuera",
    salud: ["Vacunado", "Castrado", "Desparasitado"], castrado: true,
    saludTexto: "Sano, castrado y con chequeo completo.",
    temperamento: "Tano es un osito: le encantan los abrazos y jugar con la soga. Necesita una familia con experiencia y paseos con correa.",
    rasgos: ["Mimoso", "Fuerte", "Juguetón"], convive: { perros: null, gatos: false, chicos: true }
  }
];
