"use client";

/* Mapa con Leaflet "a mano" (sin react-leaflet): el mapa se crea en un efecto y se
   destruye en su limpieza. Así sobrevive al doble montaje de StrictMode y a <Activity>
   (Cache Components oculta las páginas al navegar en vez de desmontarlas). */
import L from "leaflet";
import { useEffect, useEffectEvent, useRef } from "react";
import type { RefugioId } from "@/types";
import { CENTRO_RIO_CUARTO, LISTA_REFUGIOS, REFUGIOS } from "@/data/refugios";

export interface PropsMapa {
  activo?: RefugioId | "";
  onSeleccionar?: (id: RefugioId) => void;
  zoom?: number;
  mostrarYo?: boolean;
  /** solo un refugio (página de detalle) */
  solo?: RefugioId;
  interactivo?: boolean;
}

const HUELLA =
  '<svg viewBox="0 0 64 64" width="16" height="16" fill="currentColor" aria-hidden="true"><ellipse cx="14" cy="26" rx="6" ry="7.5"/><ellipse cx="25" cy="13" rx="6" ry="8"/><ellipse cx="39" cy="13" rx="6" ry="8"/><ellipse cx="50" cy="26" rx="6" ry="7.5"/><path d="M32 29c-8.5 0-16 10.5-16 18.2 0 5 3.4 8.3 8 8.3 3.6 0 5.2-1.8 8-1.8s4.4 1.8 8 1.8c4.6 0 8-3.3 8-8.3C48 39.5 40.5 29 32 29Z"/></svg>';

function iconoRefugio(nombre: string, activo: boolean, retraso: number | null) {
  const animacion = retraso === null ? "animation:none" : `animation-delay:${retraso}ms`;
  return L.divIcon({
    className: "leaflet-div-icon sin-fondo",
    iconSize: [0, 0],
    html: `<div style="transform:translate(-50%,-100%);width:max-content"><span class="pin-refugio${activo ? " activo" : ""}" style="${animacion}"><span class="pin-icono">${HUELLA}</span>${nombre}</span></div>`,
  });
}

const ICONO_YO = L.divIcon({
  className: "leaflet-div-icon sin-fondo",
  iconSize: [0, 0],
  html: '<div style="transform:translate(-50%,-50%)"><span class="pin-yo" style="display:block"></span></div>',
});

const UBICACION_YO: [number, number] = [-33.1155, -64.3465];

export default function MapaInterno({
  activo = "",
  onSeleccionar,
  zoom = 13,
  mostrarYo = true,
  solo,
  interactivo = true,
}: PropsMapa) {
  const nodo = useRef<HTMLDivElement>(null);
  const mapa = useRef<L.Map | null>(null);
  const marcadores = useRef(new Map<RefugioId, L.Marker>());
  const seleccionar = useEffectEvent((id: RefugioId) => onSeleccionar?.(id));

  /* Crear y destruir el mapa */
  useEffect(() => {
    const el = nodo.current;
    if (!el) return;
    const m = L.map(el, {
      center: solo ? REFUGIOS[solo].coordenadas : CENTRO_RIO_CUARTO,
      zoom: solo ? 15 : zoom,
      scrollWheelZoom: false,
      dragging: interactivo,
      zoomControl: interactivo,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(m);

    if (mostrarYo && !solo) {
      L.marker(UBICACION_YO, { icon: ICONO_YO, keyboard: false })
        .bindTooltip("Tu ubicación aproximada", { direction: "top", offset: [0, -12] })
        .addTo(m);
    }

    const lista = solo ? [REFUGIOS[solo]] : LISTA_REFUGIOS;
    const pines = marcadores.current;
    lista.forEach((r, i) => {
      const mk = L.marker(r.coordenadas, {
        icon: iconoRefugio(r.nombre, solo === r.id, i * 120),
        title: `${r.nombre}, ${r.barrio}`,
        alt: r.nombre,
      })
        .on("click", () => seleccionar(r.id))
        .addTo(m);
      pines.set(r.id, mk);
    });

    mapa.current = m;
    /* Si el contenedor cambia de tamaño (o vuelve a mostrarse), Leaflet recalcula */
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      pines.clear();
      mapa.current = null;
      m.remove();
    };
  }, [solo, mostrarYo, interactivo, zoom]);

  /* Resaltar el refugio activo y volar hasta él */
  useEffect(() => {
    const m = mapa.current;
    if (!m || solo) return;
    marcadores.current.forEach((mk, id) => mk.setIcon(iconoRefugio(REFUGIOS[id].nombre, activo === id, null)));
    if (activo) m.flyTo(REFUGIOS[activo].coordenadas, Math.max(zoom, 14), { duration: 0.9 });
  }, [activo, solo, zoom]);

  return <div ref={nodo} className="size-full" />;
}
