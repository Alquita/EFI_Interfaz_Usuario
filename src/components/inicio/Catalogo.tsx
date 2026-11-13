"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { Check, MapPinned, PawPrint, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Especie, Etapa, FiltrosCatalogo, RefugioId, Sexo, Tamano } from "@/types";
import { MASCOTAS } from "@/data/mascotas";
import { LISTA_REFUGIOS, REFUGIOS } from "@/data/refugios";
import { FILTROS_VACIOS, filtrarMascotas, NOMBRE_ETAPA, NOMBRE_TAMANO } from "@/lib/utils";
import { EsqueletoTarjeta, TarjetaMascota } from "@/components/mascotas/TarjetaMascota";

const POR_PAGINA = 8;

const ORDENES: { v: FiltrosCatalogo["orden"]; t: string }[] = [
  { v: "cercania", t: "Más cerca" },
  { v: "recientes", t: "Recién llegados" },
  { v: "menor", t: "Más jóvenes" },
  { v: "mayor", t: "Más grandes de edad" },
];

function lista<T extends string>(v: string | null, validos: readonly T[]): T[] {
  if (!v) return [];
  return v.split(",").filter((x): x is T => (validos as readonly string[]).includes(x));
}

function leerFiltros(sp: URLSearchParams): Omit<FiltrosCatalogo, "q"> {
  const orden = sp.get("orden");
  const refugio = sp.get("refugio");
  return {
    especie: lista<Especie>(sp.get("especie"), ["perro", "gato"]),
    tamano: lista<Tamano>(sp.get("tamano"), ["pequeno", "mediano", "grande"]),
    etapa: lista<Etapa>(sp.get("etapa"), ["cachorro", "joven", "adulto", "mayor"]),
    sexo: lista<Sexo>(sp.get("sexo"), ["hembra", "macho"]),
    castrado: sp.get("castrado") === "1",
    refugio: refugio && refugio in REFUGIOS ? (refugio as RefugioId) : "",
    orden: ORDENES.some((o) => o.v === orden) ? (orden as FiltrosCatalogo["orden"]) : "cercania",
  };
}

function escribirFiltros(f: Omit<FiltrosCatalogo, "q">) {
  const p = new URLSearchParams();
  if (f.especie.length) p.set("especie", f.especie.join(","));
  if (f.tamano.length) p.set("tamano", f.tamano.join(","));
  if (f.etapa.length) p.set("etapa", f.etapa.join(","));
  if (f.sexo.length) p.set("sexo", f.sexo.join(","));
  if (f.castrado) p.set("castrado", "1");
  if (f.refugio) p.set("refugio", f.refugio);
  if (f.orden !== "cercania") p.set("orden", f.orden);
  const qs = p.toString();
  /* History API nativa: Next la sincroniza con useSearchParams sin pedir nada al servidor */
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}#mascotas`);
}

function alternar<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function Catalogo() {
  const sp = useSearchParams();
  const f = useMemo(() => leerFiltros(new URLSearchParams(sp.toString())), [sp]);
  const [texto, setTexto] = useState(() => sp.get("q") ?? "");
  const q = useDeferredValue(texto);
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const resultados = useMemo(() => filtrarMascotas(MASCOTAS, { ...f, q }), [f, q]);
  const cambiar = (parcial: Partial<Omit<FiltrosCatalogo, "q">>) => {
    escribirFiltros({ ...f, ...parcial });
    setVisibles(POR_PAGINA);
  };
  const limpiar = () => {
    setTexto("");
    cambiar({ ...FILTROS_VACIOS });
  };

  const especieUnica = f.especie.length === 1 ? f.especie[0] : "";
  const activos: { clave: string; texto: string; quitar: () => void }[] = [
    ...f.especie.map((e) => ({ clave: `e${e}`, texto: e === "perro" ? "Perros" : "Gatos", quitar: () => cambiar({ especie: f.especie.filter((x) => x !== e) }) })),
    ...f.tamano.map((t) => ({ clave: `t${t}`, texto: NOMBRE_TAMANO[t], quitar: () => cambiar({ tamano: f.tamano.filter((x) => x !== t) }) })),
    ...f.etapa.map((t) => ({ clave: `a${t}`, texto: NOMBRE_ETAPA[t], quitar: () => cambiar({ etapa: f.etapa.filter((x) => x !== t) }) })),
    ...f.sexo.map((t) => ({ clave: `s${t}`, texto: t === "hembra" ? "Hembras" : "Machos", quitar: () => cambiar({ sexo: f.sexo.filter((x) => x !== t) }) })),
    ...(f.castrado ? [{ clave: "c", texto: "Castrados", quitar: () => cambiar({ castrado: false }) }] : []),
    ...(f.refugio ? [{ clave: "r", texto: REFUGIOS[f.refugio].nombre, quitar: () => cambiar({ refugio: "" }) }] : []),
  ];

  return (
    <div>
      {/* Barra de herramientas */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="grupo-input flex-1 lg:max-w-md">
          <Search className="icono-izq size-5" aria-hidden="true" />
          <label htmlFor="cat-buscar" className="sr-only">
            Buscar por nombre, barrio o carácter
          </label>
          <input
            id="cat-buscar"
            type="search"
            className="input con-accion !rounded-full"
            placeholder="Buscar por nombre, barrio o carácter…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          {texto && (
            <button type="button" className="icon-btn accion-der" aria-label="Borrar búsqueda" onClick={() => setTexto("")}>
              <X className="size-5" />
            </button>
          )}
        </div>

        <LayoutGroup id="especie">
          <div className="fila-chips !flex-nowrap" role="group" aria-label="Especie">
            {(
              [
                { v: "", t: "Todos" },
                { v: "perro", t: "Perros" },
                { v: "gato", t: "Gatos" },
              ] as const
            ).map((o) => {
              const activo = especieUnica === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  className="chip"
                  aria-pressed={activo}
                  onClick={() => cambiar({ especie: o.v ? [o.v] : [] })}
                >
                  {activo && <motion.span layoutId="chip-especie" className="chip-pildora" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  {o.t}
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="flex gap-2 lg:ml-auto">
          <label htmlFor="cat-orden" className="sr-only">
            Ordenar
          </label>
          <select
            id="cat-orden"
            className="select !min-h-11 !rounded-full !py-2"
            value={f.orden}
            onChange={(e) => cambiar({ orden: e.target.value as FiltrosCatalogo["orden"] })}
          >
            {ORDENES.map((o) => (
              <option key={o.v} value={o.v}>
                {o.t}
              </option>
            ))}
          </select>
          <PanelFiltros f={f} cambiar={cambiar} limpiar={limpiar} total={resultados.length} cantidad={activos.length} />
        </div>
      </div>

      {/* Atajos */}
      <div className="fila-chips mt-4" role="group" aria-label="Atajos de filtro">
        {[
          { t: "Cachorros", activo: f.etapa.includes("cachorro"), fn: () => cambiar({ etapa: alternar(f.etapa, "cachorro" as Etapa) }) },
          { t: "Seniors", activo: f.etapa.includes("mayor"), fn: () => cambiar({ etapa: alternar(f.etapa, "mayor" as Etapa) }) },
          { t: "Pequeños", activo: f.tamano.includes("pequeno"), fn: () => cambiar({ tamano: alternar(f.tamano, "pequeno" as Tamano) }) },
          { t: "Grandes", activo: f.tamano.includes("grande"), fn: () => cambiar({ tamano: alternar(f.tamano, "grande" as Tamano) }) },
          { t: "Castrados", activo: f.castrado, fn: () => cambiar({ castrado: !f.castrado }) },
        ].map((c) => (
          <button key={c.t} type="button" className="chip sin-pildora" aria-pressed={c.activo} onClick={c.fn}>
            {c.activo && <Check className="size-4" aria-hidden="true" />}
            {c.t}
          </button>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-6 flex flex-wrap items-center gap-2" aria-live="polite">
        <p className="mr-2 font-semibold">
          {resultados.length === 1 ? "1 mascota encontrada" : `${resultados.length} mascotas encontradas`}
        </p>
        <AnimatePresence initial={false}>
          {activos.map((a) => (
            <motion.button
              key={a.clave}
              layout
              type="button"
              className="tag tag-marca !min-h-9 cursor-pointer !py-1 text-sm hover:opacity-80"
              onClick={a.quitar}
              aria-label={`Quitar filtro ${a.texto}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {a.texto}
              <X className="size-3.5" aria-hidden="true" />
            </motion.button>
          ))}
        </AnimatePresence>
        {(activos.length > 0 || texto) && (
          <button type="button" className="btn btn-fantasma btn-sm" onClick={limpiar}>
            <RotateCcw className="size-4" aria-hidden="true" /> Limpiar
          </button>
        )}
        <Link href="/refugios" className="btn btn-fantasma btn-sm ml-auto">
          <MapPinned className="size-4" aria-hidden="true" /> Ver refugios en el mapa
        </Link>
      </div>

      {/* Grilla */}
      {resultados.length ? (
        <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {resultados.slice(0, visibles).map((m, i) => (
              <motion.li
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 28, delay: Math.min(i, 8) * 0.03 }}
              >
                <TarjetaMascota m={m} morph />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="vacio mt-6 rounded-[1.5rem] border border-dashed border-line">
          <span className="vacio-icono">
            <PawPrint className="size-10" aria-hidden="true" />
          </span>
          <h3 className="t-h3">No encontramos mascotas con esos filtros</h3>
          <p className="max-w-md text-ink-2">Probá sacar algún filtro o mirá todas. También podés activar el aviso para que te escribamos cuando llegue alguien así.</p>
          <button type="button" className="btn btn-primario mt-2" onClick={limpiar}>
            Ver todas las mascotas
          </button>
        </motion.div>
      )}

      {resultados.length > visibles && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-ink-2">
            Viendo {visibles} de {resultados.length}
          </p>
          <progress className="barra max-w-xs" value={visibles} max={resultados.length} />
          <button type="button" className="btn btn-secundario mt-2" onClick={() => setVisibles((v) => v + POR_PAGINA)}>
            Ver más mascotas
          </button>
        </div>
      )}
    </div>
  );
}

function GrupoChips<T extends string>({
  titulo,
  opciones,
  valor,
  onCambio,
}: {
  titulo: string;
  opciones: { v: T; t: string }[];
  valor: T[];
  onCambio: (v: T[]) => void;
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-3 font-semibold">{titulo}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.v}
            type="button"
            className="chip sin-pildora"
            aria-pressed={valor.includes(o.v)}
            onClick={() => onCambio(alternar(valor, o.v))}
          >
            {valor.includes(o.v) && <Check className="size-4" aria-hidden="true" />}
            {o.t}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function PanelFiltros({
  f,
  cambiar,
  limpiar,
  total,
  cantidad,
}: {
  f: Omit<FiltrosCatalogo, "q">;
  cambiar: (p: Partial<Omit<FiltrosCatalogo, "q">>) => void;
  limpiar: () => void;
  total: number;
  cantidad: number;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn btn-neutro btn-sm !rounded-full">
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filtros
        {cantidad > 0 && <span className="cuenta grid size-6 place-items-center rounded-full bg-accent text-xs text-white">{cantidad}</span>}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dlg-overlay" />
        <Dialog.Content className="dlg-hoja" aria-describedby={undefined}>
          <div className="agarradera" aria-hidden="true" />
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <Dialog.Title className="t-h3">Filtros</Dialog.Title>
            <Dialog.Close className="icon-btn" aria-label="Cerrar filtros">
              <X className="size-6" />
            </Dialog.Close>
          </div>
          <div className="grid flex-1 gap-7 overflow-y-auto px-6 py-6">
            <GrupoChips
              titulo="Especie"
              opciones={[
                { v: "perro" as Especie, t: "Perros" },
                { v: "gato" as Especie, t: "Gatos" },
              ]}
              valor={f.especie}
              onCambio={(especie) => cambiar({ especie })}
            />
            <GrupoChips
              titulo="Tamaño"
              opciones={(["pequeno", "mediano", "grande"] as Tamano[]).map((v) => ({ v, t: NOMBRE_TAMANO[v] }))}
              valor={f.tamano}
              onCambio={(tamano) => cambiar({ tamano })}
            />
            <GrupoChips
              titulo="Edad"
              opciones={(["cachorro", "joven", "adulto", "mayor"] as Etapa[]).map((v) => ({ v, t: NOMBRE_ETAPA[v] }))}
              valor={f.etapa}
              onCambio={(etapa) => cambiar({ etapa })}
            />
            <GrupoChips
              titulo="Sexo"
              opciones={[
                { v: "hembra" as Sexo, t: "Hembra" },
                { v: "macho" as Sexo, t: "Macho" },
              ]}
              valor={f.sexo}
              onCambio={(sexo) => cambiar({ sexo })}
            />
            <fieldset>
              <legend className="mb-3 font-semibold">Refugio</legend>
              <div className="grid gap-2">
                {[{ id: "", nombre: "Todos los refugios", barrio: "" }, ...LISTA_REFUGIOS].map((r) => (
                  <label key={r.id || "todos"} className="opcion">
                    <input
                      type="radio"
                      name="refugio"
                      checked={f.refugio === r.id}
                      onChange={() => cambiar({ refugio: r.id as RefugioId | "" })}
                    />
                    <span className="opcion-caja">
                      <span>
                        <span className="block font-medium">{r.nombre}</span>
                        {r.barrio && <span className="block text-sm text-ink-2">{r.barrio}</span>}
                      </span>
                      <span className="opcion-marca" aria-hidden="true" />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="fila-switch">
              <label htmlFor="sw-castrado" className="flex-1">
                <span className="block font-semibold">Solo castrados</span>
                <span className="ayuda">Listos para irse a casa</span>
              </label>
              <Switch.Root id="sw-castrado" className="switch" checked={f.castrado} onCheckedChange={(v) => cambiar({ castrado: v })}>
                <Switch.Thumb className="switch-thumb">
                  <Check className="size-3.5" strokeWidth={3} />
                </Switch.Thumb>
              </Switch.Root>
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line px-6 py-4">
            <button type="button" className="btn btn-neutro" onClick={limpiar}>
              Limpiar
            </button>
            <Dialog.Close className="btn btn-primario">Ver {total} resultados</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CatalogoCargando() {
  return (
    <div aria-busy="true" aria-label="Cargando mascotas">
      <div className="esqueleto h-12 w-full max-w-md !rounded-full" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <EsqueletoTarjeta key={i} />
        ))}
      </div>
    </div>
  );
}
