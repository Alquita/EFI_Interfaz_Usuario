/* Datos de ejemplo (no hay backend). Fotos de Unsplash con licencia libre. */
import type { Notificacion } from "@/types";

export const NOTIFICACIONES_SEMILLA: Notificacion[] = [
  { id: "n1", tipo: "success", icono: "check", titulo: "Tu solicitud por Simón fue aprobada", texto: "Hogar Gatuno RC te dejó un mensaje para coordinar el encuentro.", cuando: "Hace 2 h", leida: false, link: "/mis-solicitudes#s-simon" },
  { id: "n2", tipo: "brand", icono: "paw", titulo: "Hay 2 gatos nuevos en Banda Norte", texto: "Coinciden con tus filtros guardados.", cuando: "Hace 5 h", leida: false, link: "/?especie=gato#mascotas" },
  { id: "n3", tipo: "review", icono: "clock", titulo: "Tu solicitud por Lola está en revisión", texto: "Refugio Huellitas la recibió.", cuando: "Ayer", leida: true, link: "/mis-solicitudes#s-lola" },
  { id: "n4", tipo: "error", icono: "x", titulo: "Tu solicitud por Pancho no avanzó", texto: "Mirá el motivo y otras mascotas parecidas.", cuando: "02/10", leida: true, link: "/mis-solicitudes#s-pancho" },
  { id: "n5", tipo: "info", icono: "info", titulo: "Completá tu perfil", texto: "Con tu barrio te mostramos refugios cercanos.", cuando: "28/09", leida: true, link: "/perfil" }
];
