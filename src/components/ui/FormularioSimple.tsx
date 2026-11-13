"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Check, CircleCheck, RotateCcw, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ariaCampo, Campo, MensajeError } from "./Formulario";

export type CampoConfig = {
  id: string;
  etiqueta: string;
  tipo: "text" | "email" | "tel" | "textarea" | "select" | "chips" | "checkbox" | "number" | "date";
  opciones?: string[];
  requerido?: boolean;
  min?: number;
  ayuda?: string;
  placeholder?: string;
  medio?: boolean;
  autocompletar?: string;
};

type Valores = Record<string, string | string[] | boolean>;

function validar(c: CampoConfig, v: Valores[string]): string | undefined {
  if (c.tipo === "checkbox") return c.requerido && !v ? "Necesitamos que marques esta opción." : undefined;
  if (c.tipo === "chips") return c.requerido && !(v as string[]).length ? "Elegí al menos una opción." : undefined;
  const s = String(v ?? "").trim();
  if (!s) return c.requerido ? (c.tipo === "select" ? "Elegí una opción." : "Completá este campo.") : undefined;
  if (c.tipo === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return "Escribí un correo válido, por ejemplo nombre@correo.com.";
  if (c.tipo === "tel" && !/^[\d\s+()-]{8,}$/.test(s)) return "Escribí un teléfono con característica, por ejemplo 358 412 3456.";
  if (c.min && s.length < c.min) return `Contanos un poco más (mínimo ${c.min} caracteres).`;
  return undefined;
}

export function FormularioSimple({
  campos,
  boton = "Enviar",
  exito,
  className,
  alEnviar,
}: {
  campos: CampoConfig[];
  boton?: string;
  exito: { titulo: string; texto: string };
  className?: string;
  alEnviar?: (v: Valores) => void;
}) {
  const inicial = (): Valores =>
    Object.fromEntries(campos.map((c) => [c.id, c.tipo === "chips" ? [] : c.tipo === "checkbox" ? false : ""]));
  const [valores, setValores] = useState<Valores>(inicial);
  const [errores, setErrores] = useState<Record<string, string | undefined>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  /* Activity: si se navega después de enviar, al volver el formulario arranca limpio */
  const enviado = useRef(false);
  useLayoutEffect(
    () => () => {
      if (enviado.current) {
        enviado.current = false;
        setEstado("idle");
        setValores(inicial);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const poner = (id: string, v: Valores[string]) => {
    setValores((x) => ({ ...x, [id]: v }));
    if (errores[id]) {
      const c = campos.find((k) => k.id === id)!;
      setErrores((e) => ({ ...e, [id]: validar(c, v) }));
    }
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const nuevos = Object.fromEntries(campos.map((c) => [c.id, validar(c, valores[c.id])]));
    setErrores(nuevos);
    const primero = campos.find((c) => nuevos[c.id]);
    if (primero) {
      formRef.current?.querySelector<HTMLElement>(`[name="${primero.id}"]`)?.focus();
      return;
    }
    setEstado("enviando");
    await new Promise((r) => setTimeout(r, 900));
    alEnviar?.(valores);
    enviado.current = true;
    setEstado("ok");
  };

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {estado === "ok" ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid place-items-center gap-3 py-12 text-center"
            role="status"
          >
            <motion.span
              className="grid size-20 place-items-center rounded-full bg-success-bg text-success"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >
              <CircleCheck className="size-10" aria-hidden="true" />
            </motion.span>
            <h3 className="t-h3">{exito.titulo}</h3>
            <p className="max-w-md text-ink-2">{exito.texto}</p>
            <button
              type="button"
              className="btn btn-fantasma mt-2"
              onClick={() => {
                setValores(inicial());
                setEstado("idle");
              }}
            >
              <RotateCcw className="size-4" aria-hidden="true" /> Enviar otro
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} onSubmit={enviar} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-5 sm:grid-cols-2">
            {campos.map((c) => {
              const err = errores[c.id];
              const ancho = c.medio ? "" : "sm:col-span-2";
              if (c.tipo === "checkbox")
                return (
                  <div key={c.id} className={ancho}>
                    <label className="opcion">
                      <input
                        type="checkbox"
                        name={c.id}
                        checked={Boolean(valores[c.id])}
                        onChange={(e) => poner(c.id, e.target.checked)}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? `${c.id}-error` : undefined}
                      />
                      <span className="opcion-caja">
                        {c.etiqueta}
                        <span className="opcion-marca cuadrada" aria-hidden="true" />
                      </span>
                    </label>
                    <MensajeError id={c.id} error={err} />
                  </div>
                );
              if (c.tipo === "chips")
                return (
                  <fieldset key={c.id} className={ancho}>
                    <legend className="etiqueta mb-3">
                      {c.etiqueta}
                      {!c.requerido && <span className="opcional"> (opcional)</span>}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {c.opciones!.map((o, i) => {
                        const sel = (valores[c.id] as string[]).includes(o);
                        return (
                          <button
                            key={o}
                            type="button"
                            name={i === 0 ? c.id : undefined}
                            className="chip sin-pildora"
                            aria-pressed={sel}
                            onClick={() => {
                              const act = valores[c.id] as string[];
                              poner(c.id, sel ? act.filter((x) => x !== o) : [...act, o]);
                            }}
                          >
                            {sel && <Check className="size-4" aria-hidden="true" />}
                            {o}
                          </button>
                        );
                      })}
                    </div>
                    <MensajeError id={c.id} error={err} />
                  </fieldset>
                );
              const comunes = {
                name: c.id,
                value: String(valores[c.id]),
                onChange: (e: { target: { value: string } }) => poner(c.id, e.target.value),
                onBlur: () => setErrores((x) => ({ ...x, [c.id]: validar(c, valores[c.id]) })),
                placeholder: c.placeholder,
                autoComplete: c.autocompletar,
                ...ariaCampo(c.id, err, Boolean(c.ayuda)),
              };
              return (
                <Campo key={c.id} id={c.id} etiqueta={c.etiqueta} opcional={!c.requerido} ayuda={c.ayuda} error={err} className={ancho}>
                  {c.tipo === "textarea" ? (
                    <textarea className="textarea" {...comunes} />
                  ) : c.tipo === "select" ? (
                    <select className="select" {...comunes}>
                      <option value="">Elegí una opción</option>
                      {c.opciones!.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input className="input" type={c.tipo} inputMode={c.tipo === "tel" ? "tel" : undefined} {...comunes} />
                  )}
                </Campo>
              );
            })}
            <div className="sm:col-span-2">
              <button type="submit" className="btn btn-primario btn-lg w-full sm:w-auto" disabled={estado === "enviando"}>
                {estado === "enviando" ? (
                  <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                ) : (
                  <Send className="size-5" aria-hidden="true" />
                )}
                {estado === "enviando" ? "Enviando…" : boton}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
