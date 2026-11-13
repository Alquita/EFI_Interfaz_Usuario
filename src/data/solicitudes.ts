/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { Solicitud } from "@/types";

export const SOLICITUDES_SEMILLA: Solicitud[] = [
  {
    id: "s-lola", mascota: "lola", fecha: "2026-10-31", estado: "revision",
    mensaje: "El refugio está leyendo tu solicitud.",
    datos: { nombre: "Camila Ríos", telefono: "358 412 3456", correo: "camila.rios@correo.com", barrio: "Banda Norte", vivienda: "Casa con patio", otras: "No" }
  },
  {
    id: "s-simon", mascota: "simon", fecha: "2026-10-12", estado: "aprobada",
    mensaje: "¡Coordiná el encuentro! Hogar Gatuno RC te dejó un mensaje.",
    mensajeRefugio: "¡Hola, Camila! Nos encantó tu solicitud para Simón. ¿Te queda bien venir el sábado a las 11 h a conocerlo? Traé una transportadora y, si podés, una foto de las ventanas con red. Cualquier duda, escribinos."
  },
  {
    id: "s-pancho", mascota: "pancho", fecha: "2026-10-02", estado: "rechazada",
    mensaje: "El refugio busca para él un hogar con patio y sin escaleras, por su raza y su edad.",
    mensajeRefugio: "Gracias por tu interés en Pancho. Por ahora buscamos una casa sin escaleras porque le cuesta subirlas. Te recomendamos conocer a Bruno o a Copito, que se adaptan muy bien a departamentos con ascensor."
  }
];
