/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { Evento } from "@/types";

export const EVENTOS: Evento[] = [
  { id: "e1", fecha: "2026-11-21", hora: "10 a 14 h", tipo: "adopcion", titulo: "Feria de adopción responsable", lugar: "Plaza Roca, Centro", organiza: "Los 3 refugios aliados", descripcion: "Conocé a más de 30 perros y gatos, charlá con los refugios y empezá tu solicitud ahí mismo." },
  { id: "e2", fecha: "2026-11-28", hora: "8 a 12 h", tipo: "castracion", titulo: "Jornada de castración gratuita", lugar: "Centro vecinal Banda Norte", organiza: "Municipalidad y Patitas Río Cuarto", descripcion: "Para perros y gatos desde los 6 meses. Con turno previo y ayuno de 8 horas." },
  { id: "e3", fecha: "2026-12-05", hora: "9 a 13 h", tipo: "salud", titulo: "Vacunación antirrábica", lugar: "Parque Sarmiento", organiza: "Refugio Huellitas", descripcion: "Vacuna antirrábica gratuita y control básico. Traé la libreta sanitaria si tenés." },
  { id: "e4", fecha: "2026-12-12", hora: "16 a 20 h", tipo: "colecta", titulo: "Colecta navideña de alimento", lugar: "Refugio Huellitas, Alberdi", organiza: "Refugio Huellitas", descripcion: "Juntamos alimento, mantas y piedras sanitarias para las fiestas." },
  { id: "e5", fecha: "2026-12-17", hora: "19 h", tipo: "charla", titulo: "Charla: los primeros días en casa", lugar: "Virtual (te mandamos el enlace)", organiza: "Hogar Gatuno RC", descripcion: "Cómo preparar la casa, presentar a otras mascotas y qué esperar las primeras semanas." }
];
