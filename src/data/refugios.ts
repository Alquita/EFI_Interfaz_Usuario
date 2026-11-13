/* Refugios aliados (datos de ejemplo). Coordenadas aproximadas dentro de Río Cuarto. */
import type { Refugio, RefugioId } from "@/types";

export const CENTRO_RIO_CUARTO: [number, number] = [-33.1236, -64.349];

export const REFUGIOS: Record<RefugioId, Refugio> = {
  huellitas: {
    id: "huellitas",
    nombre: "Refugio Huellitas",
    barrio: "Alberdi",
    distancia: 1.2,
    horario: "Sáb. y dom. de 10 a 13 h",
    horarioLargo: "Atiende sábados y domingos de 10 a 13 h",
    telefono: "358 400 1122",
    especies: "Perros y gatos",
    descripcion:
      "Rescata perros y gatos de la zona sur y los prepara para la adopción con vacunas y castración al día.",
    foto: "/img/varios/patita.jpg",
    coordenadas: [-33.1335, -64.3612],
    necesidades: [
      { item: "Alimento para perros adultos", porcentaje: 62 },
      { item: "Mantas y camitas", porcentaje: 80 },
      { item: "Antiparasitarios", porcentaje: 25 },
    ],
  },
  gatuno: {
    id: "gatuno",
    nombre: "Hogar Gatuno RC",
    barrio: "Banda Norte",
    distancia: 2.8,
    horario: "Lun. a vie. de 17 a 20 h",
    horarioLargo: "Atiende de lunes a viernes de 17 a 20 h",
    telefono: "358 400 3344",
    especies: "Solo gatos",
    descripcion:
      "Red de hogares de tránsito especializada en gatos, desde bebés hasta seniors.",
    foto: "/img/varios/gato-mano.jpg",
    coordenadas: [-33.1068, -64.3435],
    necesidades: [
      { item: "Piedras sanitarias", porcentaje: 35 },
      { item: "Alimento para gatitos", porcentaje: 58 },
      { item: "Transportadoras", porcentaje: 15 },
    ],
  },
  patitas: {
    id: "patitas",
    nombre: "Patitas Río Cuarto",
    barrio: "Barrio Golf",
    distancia: 3.5,
    horario: "Sáb. de 9 a 12 h",
    horarioLargo: "Atiende los sábados de 9 a 12 h",
    telefono: "358 400 5566",
    especies: "Perros",
    descripcion:
      "Grupo de rescatistas que trabaja con perros adultos y mayores, los que más tardan en encontrar hogar.",
    foto: "/img/varios/paseador.jpg",
    coordenadas: [-33.1292, -64.3249],
    necesidades: [
      { item: "Suplementos para articulaciones", porcentaje: 40 },
      { item: "Alimento senior", porcentaje: 70 },
      { item: "Correas y pecheras", porcentaje: 52 },
    ],
  },
};

export const LISTA_REFUGIOS = Object.values(REFUGIOS);
