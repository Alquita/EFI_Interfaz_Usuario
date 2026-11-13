"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "motion/react";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { MessageCircle, Plus, Search, X } from "lucide-react";
import type { CategoriaPregunta } from "@/types";
import { CATEGORIAS, PREGUNTAS } from "@/data/preguntas";

function normalizar(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function Resaltar({ texto, q }: { texto: string; q: string }) {
  if (!q) return <>{texto}</>;
  const i = normalizar(texto).indexOf(normalizar(q));
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <mark className="rounded bg-accent-soft px-0.5 text-brand">{texto.slice(i, i + q.length)}</mark>
      {texto.slice(i + q.length)}
    </>
  );
}

export function Ayuda() {
  const [cat, setCat] = useState<CategoriaPregunta | "todas">("todas");
  const [texto, setTexto] = useState("");
  const q = useDeferredValue(texto.trim());
  const lista = PREGUNTAS.filter((p) => (cat === "todas" || p.cat === cat) && (!q || normalizar(p.p + " " + p.r).includes(normalizar(q))));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="grupo-input">
        <Search className="icono-izq size-5" aria-hidden="true" />
        <label htmlFor="faq-q" className="sr-only">
          Buscar en las preguntas
        </label>
        <input id="faq-q" type="search" className="input con-accion !min-h-14 !rounded-full text-lg" placeholder="Buscá: castración, alquiler, modo oscuro…" value={texto} onChange={(e) => setTexto(e.target.value)} />
        {texto && (
          <button type="button" className="icon-btn accion-der" aria-label="Borrar búsqueda" onClick={() => setTexto("")}>
            <X className="size-5" />
          </button>
        )}
      </div>
      <div className="fila-chips mt-5" role="group" aria-label="Categorías">
        {CATEGORIAS.map((c) => (
          <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
            {cat === c.id && <motion.span layoutId="faq-cat" className="chip-pildora" />}
            {c.nombre}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-2" aria-live="polite">
        {lista.length} {lista.length === 1 ? "pregunta" : "preguntas"}
      </p>
      <Accordion.Root type="multiple" className="mt-2 border-t border-line">
        {lista.map((p, i) => (
          <motion.div key={p.p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.03 }}>
            <Accordion.Item value={p.p} className="acordeon-item">
              <Accordion.Header>
                <Accordion.Trigger className="acordeon-disparador">
                  <span>
                    <Resaltar texto={p.p} q={q} />
                  </span>
                  <Plus className="size-5" aria-hidden="true" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="acordeon-contenido">
                <p className="px-1 pb-5 leading-7">
                  <Resaltar texto={p.r} q={q} />
                </p>
              </Accordion.Content>
            </Accordion.Item>
          </motion.div>
        ))}
      </Accordion.Root>
      {!lista.length && <p className="vacio text-ink-2">No encontramos nada con “{texto}”. Probá otra palabra o escribinos.</p>}
      <div className="panel-marca mt-12 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <span className="icono-modal">
          <MessageCircle className="size-6" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="t-h4">¿No encontraste lo que buscabas?</p>
          <p className="text-ink-2">Escribinos y te respondemos en el día.</p>
        </div>
        <Link href="/contacto" className="btn btn-primario">
          Escribinos
        </Link>
      </div>
    </div>
  );
}
