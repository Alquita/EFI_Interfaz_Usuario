import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Etapa, FiltrosCatalogo, Mascota } from "@/types";
import type { Respuestas } from "@/data/guia";

export function cn(...clases: ClassValue[]) {
  return twMerge(clsx(clases));
}

/* Fecha de referencia fija: los datos de ejemplo están fechados en noviembre de 2026.
   Usarla (en vez de Date.now) mantiene el render puro y sin diferencias servidor/cliente. */
export const HOY = new Date("2026-11-13T12:00:00-03:00");

export function diasDesde(fechaIso: string) {
  const d = new Date(`${fechaIso}T12:00:00-03:00`);
  return Math.max(0, Math.round((HOY.getTime() - d.getTime()) / 86_400_000));
}

export function haceCuanto(fechaIso: string) {
  const dias = diasDesde(fechaIso);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias < 7) return `Hace ${dias} días`;
  if (dias < 30) {
    const s = Math.round(dias / 7);
    return s === 1 ? "Hace 1 semana" : `Hace ${s} semanas`;
  }
  const m = Math.round(dias / 30);
  return m === 1 ? "Hace 1 mes" : `Hace ${m} meses`;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function partesFecha(fechaIso: string) {
  const [a, m, d] = fechaIso.split("-").map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d, 12));
  return {
    dia: d,
    mes: MESES[m - 1],
    mesLargo: MESES_LARGOS[m - 1],
    diaSemana: DIAS[fecha.getUTCDay()],
    anio: a,
  };
}

export function fechaLarga(fechaIso: string) {
  const p = partesFecha(fechaIso);
  return `${p.diaSemana} ${p.dia} de ${p.mesLargo}`;
}

export function fechaCorta(fechaIso: string) {
  const p = partesFecha(fechaIso);
  return `${p.dia} ${p.mes} ${p.anio}`;
}

export function pesos(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR").replace(/,/g, ".");
}

export function miles(n: number) {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function etapaDe(edadMeses: number): Etapa {
  if (edadMeses < 12) return "cachorro";
  if (edadMeses < 36) return "joven";
  if (edadMeses < 96) return "adulto";
  return "mayor";
}

export const NOMBRE_ETAPA: Record<Etapa, string> = {
  cachorro: "Cachorro",
  joven: "Joven",
  adulto: "Adulto",
  mayor: "Senior",
};

export const NOMBRE_TAMANO = { pequeno: "Pequeño", mediano: "Mediano", grande: "Grande" } as const;

export const FILTROS_VACIOS: FiltrosCatalogo = {
  q: "",
  especie: [],
  tamano: [],
  etapa: [],
  sexo: [],
  castrado: false,
  refugio: "",
  orden: "cercania",
};

function sinTildes(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filtrarMascotas(lista: Mascota[], f: FiltrosCatalogo) {
  const q = sinTildes(f.q.trim());
  const res = lista.filter((m) => {
    if (f.especie.length && !f.especie.includes(m.especie)) return false;
    if (f.tamano.length && !f.tamano.includes(m.tamano)) return false;
    if (f.etapa.length && !f.etapa.includes(etapaDe(m.edadMeses))) return false;
    if (f.sexo.length && !f.sexo.includes(m.sexo)) return false;
    if (f.castrado && !m.castrado) return false;
    if (f.refugio && m.refugio !== f.refugio) return false;
    if (q) {
      const texto = sinTildes([m.nombre, m.tipo, m.barrio, ...m.rasgos].join(" "));
      if (!texto.includes(q)) return false;
    }
    return true;
  });
  const orden = {
    cercania: (a: Mascota, b: Mascota) => a.distancia - b.distancia,
    recientes: (a: Mascota, b: Mascota) => b.publicado.localeCompare(a.publicado),
    menor: (a: Mascota, b: Mascota) => a.edadMeses - b.edadMeses,
    mayor: (a: Mascota, b: Mascota) => b.edadMeses - a.edadMeses,
  }[f.orden];
  return res.sort(orden);
}

export function esNueva(m: Mascota) {
  return diasDesde(m.publicado) <= 5;
}

/* Test de compatibilidad (Guía): puntúa cada mascota de 0 a 100 */

export function compatibilidad(m: Mascota, r: Partial<Respuestas>) {
  let puntos = 60;
  const motivos: string[] = [];
  const alertas: string[] = [];

  if (r.especie && r.especie !== "igual") {
    if (r.especie === m.especie) puntos += 15;
    else puntos -= 40;
  }
  if (r.vivienda === "depto") {
    if (m.tamano === "grande") {
      puntos -= 18;
      alertas.push("Es grande para un departamento");
    } else if (m.especie === "gato" || m.tamano === "pequeno") {
      puntos += 10;
      motivos.push("Ideal para departamento");
    }
  }
  if (r.vivienda === "patio" && m.especie === "perro" && m.tamano !== "pequeno") {
    puntos += 10;
    motivos.push("Va a disfrutar tu patio");
  }
  const activo = m.rasgos.some((x) => /activ|jugu|aventur/i.test(x)) || m.edadMeses < 12;
  const tranquilo = m.rasgos.some((x) => /tranquil|seren|dormil|senior|regazo/i.test(x));
  if (r.tiempo === "poco") {
    if (activo) {
      puntos -= 15;
      alertas.push("Necesita bastante tiempo y energía");
    }
    if (tranquilo) {
      puntos += 12;
      motivos.push("Es tranquilo: se adapta a tu ritmo");
    }
  }
  if (r.tiempo === "mucho" && activo) {
    puntos += 12;
    motivos.push("Tiene la energía que buscás");
  }
  if (r.chicos === "si") {
    if (m.convive.chicos === true) {
      puntos += 8;
      motivos.push("Se lleva bien con chicos");
    } else if (m.convive.chicos === false) {
      puntos -= 30;
      alertas.push("No convive con chicos");
    }
  }
  if (r.otros === "perro" || r.otros === "gato") {
    const v = r.otros === "perro" ? m.convive.perros : m.convive.gatos;
    if (v === true) {
      puntos += 10;
      motivos.push(`Convive con ${r.otros}s`);
    } else if (v === false) {
      puntos -= 35;
      alertas.push(`No convive con ${r.otros}s`);
    } else alertas.push(`Todavía no lo probaron con ${r.otros}s`);
  }
  return { puntos: Math.max(5, Math.min(99, puntos)), motivos, alertas };
}
