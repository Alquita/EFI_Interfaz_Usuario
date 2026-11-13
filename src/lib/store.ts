/* =========================================================================
   Estado de la app (sin backend): favoritos, solicitudes, notificaciones,
   sesión, ajustes, publicaciones y reportes. Se guarda en localStorage y se
   lee con useSyncExternalStore para que el HTML del servidor y la primera
   hidratación usen los mismos datos semilla (sin errores de hidratación).
   ========================================================================= */
import { useSyncExternalStore } from "react";
import type {
  Ajustes,
  DatosSolicitud,
  Notificacion,
  Publicacion,
  ReportePerdido,
  Solicitud,
  Usuario,
} from "@/types";
import type { Respuestas } from "@/data/guia";
import { SOLICITUDES_SEMILLA } from "@/data/solicitudes";
import { NOTIFICACIONES_SEMILLA } from "@/data/notificaciones";

export type Tema = "claro" | "oscuro" | "sistema";

export interface Estado {
  favoritos: string[];
  solicitudes: Solicitud[];
  notificaciones: Notificacion[];
  usuario: Usuario | null;
  ajustes: Ajustes;
  tema: Tema;
  publicaciones: Publicacion[];
  reportes: ReportePerdido[];
  checklist: number[];
  test: Partial<Respuestas> | null;
  recordatorios: string[];
  descartados: string[];
  padrinazgos: string[];
  visitas: { mascota: string; dia: string; hora: string }[];
}

import { CLAVE_ESTADO } from "./apariencia";
export { CLAVE_ESTADO };

const INICIAL: Estado = {
  favoritos: ["mora", "bruno", "copito"],
  solicitudes: SOLICITUDES_SEMILLA,
  notificaciones: NOTIFICACIONES_SEMILLA,
  usuario: { nombre: "Camila Ríos", correo: "camila.rios@correo.com", barrio: "Banda Norte" },
  ajustes: {
    notifSolicitudes: true,
    notifCerca: true,
    notifCorreo: false,
    reducirMovimiento: false,
    textoGrande: false,
  },
  tema: "sistema",
  publicaciones: [],
  reportes: [],
  checklist: [],
  test: null,
  recordatorios: [],
  descartados: [],
  padrinazgos: [],
  visitas: [],
};

let estado: Estado = INICIAL;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === "undefined") return;
  cargado = true;
  try {
    const crudo = window.localStorage.getItem(CLAVE_ESTADO);
    if (crudo) {
      const guardado = JSON.parse(crudo) as Partial<Estado>;
      estado = {
        ...INICIAL,
        ...guardado,
        ajustes: { ...INICIAL.ajustes, ...guardado.ajustes },
      };
    }
  } catch {
    /* almacenamiento bloqueado o JSON roto: seguimos con la semilla */
  }
}

function emitir() {
  oyentes.forEach((o) => o());
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  const alCambiarOtraPestana = (e: StorageEvent) => {
    if (e.key !== CLAVE_ESTADO) return;
    cargado = false;
    estado = INICIAL;
    cargar();
    emitir();
  };
  window.addEventListener("storage", alCambiarOtraPestana);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", alCambiarOtraPestana);
  };
}

function leer() {
  cargar();
  return estado;
}

function leerServidor() {
  return INICIAL;
}

export function useEstado() {
  return useSyncExternalStore(suscribir, leer, leerServidor);
}

/** true recién cuando el cliente ya leyó el localStorage (evita parpadeos en contadores) */
export function useHidratado() {
  return useSyncExternalStore(
    suscribirNada,
    () => true,
    () => false,
  );
}

function suscribirNada() {
  return () => {};
}

export function obtenerEstado() {
  return leer();
}

function actualizar(cambio: (e: Estado) => Partial<Estado>) {
  cargar();
  estado = { ...estado, ...cambio(estado) };
  try {
    window.localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
  } catch {
    /* sin espacio o modo privado */
  }
  emitir();
}

function hoyIso() {
  return new Date().toISOString().slice(0, 10);
}

function nuevaNotificacion(n: Omit<Notificacion, "id" | "leida" | "cuando">): Notificacion {
  return { ...n, id: `n${Date.now()}`, leida: false, cuando: "Recién" };
}

/* ------------------------------------------------------------------ Acciones */
export const acciones = {
  alternarFavorito(id: string) {
    const ya = leer().favoritos.includes(id);
    actualizar((e) => ({
      favoritos: ya ? e.favoritos.filter((f) => f !== id) : [id, ...e.favoritos],
    }));
    return !ya;
  },

  enviarSolicitud(mascotaId: string, nombreMascota: string, datos: DatosSolicitud) {
    const id = `s-${mascotaId}`;
    actualizar((e) => ({
      solicitudes: [
        {
          id,
          mascota: mascotaId,
          fecha: hoyIso(),
          estado: "revision",
          mensaje: "El refugio recibió tu solicitud y la va a leer en las próximas 48 h.",
          datos,
        },
        ...e.solicitudes.filter((s) => s.id !== id),
      ],
      notificaciones: [
        nuevaNotificacion({
          tipo: "review",
          icono: "clock",
          titulo: `Tu solicitud por ${nombreMascota} está en revisión`,
          texto: "Te avisamos apenas el refugio responda.",
          link: `/mis-solicitudes#${id}`,
        }),
        ...e.notificaciones,
      ],
    }));
    return id;
  },

  cancelarSolicitud(id: string) {
    actualizar((e) => ({
      solicitudes: e.solicitudes.map((s) =>
        s.id === id ? { ...s, estado: "cancelada", mensaje: "Cancelaste esta solicitud." } : s,
      ),
    }));
  },

  marcarLeida(id: string) {
    actualizar((e) => ({
      notificaciones: e.notificaciones.map((n) => (n.id === id ? { ...n, leida: true } : n)),
    }));
  },

  marcarTodasLeidas() {
    actualizar((e) => ({ notificaciones: e.notificaciones.map((n) => ({ ...n, leida: true })) }));
  },

  borrarNotificacion(id: string) {
    actualizar((e) => ({ notificaciones: e.notificaciones.filter((n) => n.id !== id) }));
  },

  restaurarNotificaciones(lista: Notificacion[]) {
    actualizar(() => ({ notificaciones: lista }));
  },

  ingresar(usuario: Usuario) {
    actualizar(() => ({ usuario }));
  },

  salir() {
    actualizar(() => ({ usuario: null }));
  },

  editarPerfil(datos: Partial<Usuario>) {
    actualizar((e) => ({ usuario: e.usuario ? { ...e.usuario, ...datos } : e.usuario }));
  },

  cambiarAjuste<K extends keyof Ajustes>(clave: K, valor: Ajustes[K]) {
    actualizar((e) => ({ ajustes: { ...e.ajustes, [clave]: valor } }));
  },

  cambiarTema(tema: Tema) {
    actualizar(() => ({ tema }));
  },

  publicar(datos: { nombre: string; especie: string }) {
    actualizar((e) => ({
      publicaciones: [
        { id: `pub${Date.now()}`, nombre: datos.nombre, especie: datos.especie, fecha: hoyIso(), estado: "revision" },
        ...e.publicaciones,
      ],
      notificaciones: [
        nuevaNotificacion({
          tipo: "info",
          icono: "info",
          titulo: `Recibimos la publicación de ${datos.nombre}`,
          texto: "Un refugio aliado la revisa en 48 h y te escribe por correo.",
          link: "/perfil#publicaciones",
        }),
        ...e.notificaciones,
      ],
    }));
  },

  reportar(reporte: Omit<ReportePerdido, "id" | "fecha">) {
    actualizar((e) => ({
      reportes: [{ ...reporte, id: `r${Date.now()}`, fecha: hoyIso() }, ...e.reportes],
    }));
  },

  alternarChecklist(i: number) {
    actualizar((e) => ({
      checklist: e.checklist.includes(i) ? e.checklist.filter((x) => x !== i) : [...e.checklist, i],
    }));
  },

  guardarTest(r: Partial<Respuestas> | null) {
    actualizar(() => ({ test: r }));
  },

  alternarRecordatorio(eventoId: string) {
    const ya = leer().recordatorios.includes(eventoId);
    actualizar((e) => ({
      recordatorios: ya ? e.recordatorios.filter((x) => x !== eventoId) : [...e.recordatorios, eventoId],
    }));
    return !ya;
  },

  descartar(id: string) {
    actualizar((e) => ({ descartados: [...e.descartados.filter((x) => x !== id), id] }));
  },

  deshacerDescarte(id: string) {
    actualizar((e) => ({ descartados: e.descartados.filter((x) => x !== id) }));
  },

  reiniciarDescubrir() {
    actualizar(() => ({ descartados: [] }));
  },

  apadrinar(id: string) {
    actualizar((e) => ({ padrinazgos: e.padrinazgos.includes(id) ? e.padrinazgos : [...e.padrinazgos, id] }));
  },

  agendarVisita(v: { mascota: string; dia: string; hora: string }) {
    actualizar((e) => ({ visitas: [v, ...e.visitas.filter((x) => x.mascota !== v.mascota)] }));
  },

  reiniciarTodo() {
    actualizar(() => INICIAL);
  },
};
