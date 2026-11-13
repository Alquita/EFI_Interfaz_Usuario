"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type DragEvent } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Cat, Check, CircleCheck, Dog, ImagePlus, Info, RotateCcw, Search, Send, X } from "lucide-react";
import { BARRIOS } from "@/data/barrios";
import { acciones } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ariaCampo, Campo, MensajeError } from "@/components/ui/Formulario";
import { Confeti } from "@/components/ui/Confeti";
import { useMovimientoReducido } from "@/components/sitio/Proveedores";

const SALUD = ["Vacunado", "Castrado", "Desparasitado", "Con chip"];
const MAX_FOTOS = 4;

const esquema = z.object({
  nombre: z.string().trim().min(2, "Escribí un nombre (puede ser provisorio)."),
  especie: z.enum(["perro", "gato"], { error: "Elegí perro o gato." }),
  sexo: z.string().min(1, "Elegí el sexo."),
  edad: z.string().min(1, "Elegí una edad aproximada."),
  tamano: z.string().min(1, "Elegí el tamaño."),
  barrio: z.string().min(1, "Elegí el barrio."),
  motivo: z.string().min(1, "Contanos por qué lo publicás."),
  salud: z.array(z.string()),
  descripcion: z.string().trim().min(40, "Contanos un poco más (mínimo 40 caracteres).").max(600),
  telefono: z.string().trim().regex(/^[\d\s+()-]{8,}$/, "Escribí un teléfono con característica."),
  fotos: z.number().min(1, "Subí al menos una foto: es lo primero que miran las familias."),
  acepto: z.boolean().refine((v) => v, "Tenés que aceptar que un refugio revise la publicación."),
});

type Datos = z.infer<typeof esquema>;

export function DarEnAdopcion() {
  const [fotos, setFotos] = useState<{ url: string; nombre: string }[]>([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [listo, setListo] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const reducido = useMovimientoReducido();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Datos>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: { nombre: "", sexo: "", edad: "", tamano: "", barrio: "", motivo: "", salud: [], descripcion: "", telefono: "", fotos: 0, acepto: false },
  });
  const motivo = useWatch({ control, name: "motivo" });
  const especie = useWatch({ control, name: "especie" });
  const descripcion = useWatch({ control, name: "descripcion" }) ?? "";

  /* Libera las URLs de vista previa al desmontar */
  const fotosRef = useRef(fotos);
  useEffect(() => {
    fotosRef.current = fotos;
  }, [fotos]);
  useEffect(() => () => fotosRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);

  /* Activity: al volver después de publicar, el formulario arranca de cero */
  useLayoutEffect(() => () => setListo(null), []);

  const agregar = (lista: FileList | null) => {
    if (!lista) return;
    const nuevas = Array.from(lista)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_FOTOS - fotos.length)
      .map((f) => ({ url: URL.createObjectURL(f), nombre: f.name }));
    const total = [...fotos, ...nuevas];
    setFotos(total);
    setValue("fotos", total.length, { shouldValidate: true });
  };

  const quitar = (url: string) => {
    URL.revokeObjectURL(url);
    const total = fotos.filter((f) => f.url !== url);
    setFotos(total);
    setValue("fotos", total.length, { shouldValidate: true });
  };

  const soltar = (e: DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    agregar(e.dataTransfer.files);
  };

  const enviar = async (d: Datos) => {
    await new Promise((r) => setTimeout(r, 1000));
    acciones.publicar({ nombre: d.nombre, especie: d.especie });
    setListo(d.nombre);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (listo) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="tarjeta mx-auto max-w-2xl p-8 text-center md:p-12">
        {!reducido && <Confeti />}
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="mx-auto grid size-20 place-items-center rounded-full bg-success-bg text-success">
          <CircleCheck className="size-10" aria-hidden="true" />
        </motion.span>
        <h2 className="t-h2 mt-6">¡Recibimos la publicación de {listo}!</h2>
        <p className="t-lead mt-3">Un refugio aliado revisa los datos y las fotos en 48 h y te escribe. Mientras tanto la ves en tu perfil como “En revisión”.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/perfil#publicaciones" className="btn btn-primario">
            Ver mis publicaciones
          </Link>
          <button
            type="button"
            className="btn btn-neutro"
            onClick={() => {
              reset();
              setFotos([]);
              setListo(null);
            }}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Publicar otro
          </button>
        </div>
      </motion.div>
    );
  }

  const radioTarjetas = (nombre: "sexo" | "tamano" | "edad", opciones: string[], cols = "grid-cols-2 sm:grid-cols-3") => (
    <div className={cn("grid gap-2", cols)}>
      {opciones.map((o) => (
        <label key={o} className="opcion">
          <input type="radio" value={o} {...register(nombre)} />
          <span className="opcion-caja !min-h-12 justify-center !py-2 text-center font-medium">{o}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="grid gap-8">
      <section className="tarjeta grid gap-6 p-6 md:p-8" aria-labelledby="s-animal">
        <h2 id="s-animal" className="t-h3">
          <span className="text-brand">1.</span> El animal
        </h2>
        <fieldset>
          <legend className="etiqueta mb-3">Especie</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: "perro", t: "Perro", i: Dog },
              { v: "gato", t: "Gato", i: Cat },
            ].map((o) => (
              <label key={o.v} className="opcion">
                <input type="radio" value={o.v} {...register("especie")} />
                <span className="opcion-caja !py-5">
                  <o.i className="size-7" aria-hidden="true" />
                  <span className="text-lg font-semibold">{o.t}</span>
                  <span className="opcion-marca" aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
          <MensajeError id="especie" error={errors.especie?.message} />
        </fieldset>
        <div className="grid gap-6 sm:grid-cols-2">
          <Campo id="nombre" etiqueta="Nombre" ayuda="Si no tiene, poné uno provisorio." error={errors.nombre?.message}>
            <input className="input" {...ariaCampo("nombre", errors.nombre?.message, true)} {...register("nombre")} />
          </Campo>
          <Campo id="barrio" etiqueta="¿En qué barrio está?" error={errors.barrio?.message}>
            <select className="select" {...ariaCampo("barrio", errors.barrio?.message)} {...register("barrio")}>
              <option value="">Elegí el barrio</option>
              {BARRIOS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Campo>
        </div>
        <fieldset>
          <legend className="etiqueta mb-3">Sexo</legend>
          {radioTarjetas("sexo", ["Hembra", "Macho", "No sé"])}
          <MensajeError id="sexo" error={errors.sexo?.message} />
        </fieldset>
        <fieldset>
          <legend className="etiqueta mb-3">Edad aproximada</legend>
          {radioTarjetas("edad", ["Menos de 1 año", "1 a 3 años", "3 a 8 años", "Más de 8 años"], "grid-cols-2 sm:grid-cols-4")}
          <MensajeError id="edad" error={errors.edad?.message} />
        </fieldset>
        {especie !== "gato" && (
          <fieldset>
            <legend className="etiqueta mb-3">Tamaño</legend>
            {radioTarjetas("tamano", ["Pequeño", "Mediano", "Grande"])}
            <MensajeError id="tamano" error={errors.tamano?.message} />
          </fieldset>
        )}
        {especie === "gato" && <input type="hidden" value="Pequeño" {...register("tamano")} />}
        <Controller
          control={control}
          name="salud"
          render={({ field }) => (
            <fieldset>
              <legend className="etiqueta mb-3">
                Salud <span className="opcional">(marcá lo que tenga)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {SALUD.map((s) => {
                  const sel = field.value.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      className="chip sin-pildora"
                      aria-pressed={sel}
                      onClick={() => field.onChange(sel ? field.value.filter((x) => x !== s) : [...field.value, s])}
                    >
                      {sel && <Check className="size-4" aria-hidden="true" />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />
      </section>

      <section className="tarjeta grid gap-6 p-6 md:p-8" aria-labelledby="s-fotos">
        <h2 id="s-fotos" className="t-h3">
          <span className="text-brand">2.</span> Fotos
        </h2>
        <p className="-mt-3 text-ink-2">Hasta {MAX_FOTOS}. Con luz natural, a la altura de sus ojos y de cuerpo entero.</p>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence initial={false}>
            {fotos.map((f) => (
              <motion.div
                key={f.url}
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="group relative size-[6.5rem] overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
                <img src={f.url} alt={`Foto subida: ${f.nombre}`} className="size-full object-cover" />
                <button type="button" onClick={() => quitar(f.url)} className="icon-btn icon-btn-vidrio absolute right-1 top-1 !size-8 bg-black/40" aria-label={`Quitar ${f.nombre}`}>
                  <X className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {fotos.length < MAX_FOTOS && (
            <label
              className={cn("tile-subir", arrastrando && "arrastrando")}
              data-invalido={errors.fotos ? "true" : undefined}
              onDragOver={(e) => {
                e.preventDefault();
                setArrastrando(true);
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={soltar}
            >
              <ImagePlus className="size-7" aria-hidden="true" />
              <span className="text-sm font-semibold">Agregar</span>
              <input
                ref={input}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                aria-describedby={errors.fotos ? "fotos-error" : undefined}
                onChange={(e) => {
                  agregar(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
        <MensajeError id="fotos" error={errors.fotos?.message} />
      </section>

      <section className="tarjeta grid gap-6 p-6 md:p-8" aria-labelledby="s-historia">
        <h2 id="s-historia" className="t-h3">
          <span className="text-brand">3.</span> Su historia y tu contacto
        </h2>
        <Campo id="motivo" etiqueta="¿Por qué lo publicás?" error={errors.motivo?.message}>
          <select className="select" {...ariaCampo("motivo", errors.motivo?.message)} {...register("motivo")}>
            <option value="">Elegí una opción</option>
            <option>Lo encontré en la calle</option>
            <option>No puedo seguir cuidándolo</option>
            <option>Es de una camada</option>
            <option>Soy rescatista</option>
          </select>
        </Campo>
        <AnimatePresence>
          {motivo === "Lo encontré en la calle" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="alerta alerta-info">
                <Info className="size-5 shrink-0" aria-hidden="true" />
                <p>
                  Alguien lo puede estar buscando. Primero publicalo en{" "}
                  <Link href="/perdidos">Perdidos y encontrados</Link>: si en 7 días nadie lo reclama, podés darlo en adopción.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Campo
          id="descripcion"
          etiqueta="Contanos cómo es"
          ayuda="Carácter, con quién se lleva bien, qué le gusta. Una buena descripción ayuda a encontrar la familia justa."
          error={errors.descripcion?.message}
          extra={<span className="contador">{descripcion.length}/600</span>}
        >
          <textarea className="textarea" maxLength={600} {...ariaCampo("descripcion", errors.descripcion?.message, true)} {...register("descripcion")} />
        </Campo>
        <Campo id="telefono" etiqueta="Tu teléfono" ayuda="Solo lo ve el refugio que revisa la publicación." error={errors.telefono?.message}>
          <input className="input sm:max-w-xs" type="tel" inputMode="tel" autoComplete="tel" placeholder="358 412 3456" {...ariaCampo("telefono", errors.telefono?.message, true)} {...register("telefono")} />
        </Campo>
        <div>
          <label className="opcion">
            <input type="checkbox" {...register("acepto")} aria-describedby={errors.acepto ? "acepto-error" : undefined} />
            <span className="opcion-caja">
              Acepto que un refugio aliado revise la publicación antes de que salga
              <span className="opcion-marca cuadrada" aria-hidden="true" />
            </span>
          </label>
          <MensajeError id="acepto" error={errors.acepto?.message} />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primario btn-lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          ) : (
            <Send className="size-5" aria-hidden="true" />
          )}
          {isSubmitting ? "Enviando…" : "Enviar a revisión"}
        </button>
        <Link href="/perdidos" className="btn btn-fantasma">
          <Search className="size-4" aria-hidden="true" /> ¿Se perdió o lo encontraste? Reportalo acá
        </Link>
      </div>
    </form>
  );
}
