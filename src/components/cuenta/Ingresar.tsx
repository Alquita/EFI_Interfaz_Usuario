"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff, LogIn, UserPlus, Zap } from "lucide-react";
import { BARRIOS } from "@/data/barrios";
import { acciones } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ariaCampo, Campo } from "@/components/ui/Formulario";

const esquema = z
  .object({
    modo: z.enum(["ingresar", "registro"]),
    correo: z.string().trim().email("Escribí un correo válido, por ejemplo nombre@correo.com."),
    clave: z.string(),
    nombre: z.string(),
    barrio: z.string(),
  })
  .superRefine((d, ctx) => {
    const error = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (d.modo === "ingresar") {
      if (d.clave.length < 6) error("clave", "La contraseña tiene al menos 6 caracteres.");
      return;
    }
    if (d.nombre.trim().length < 3) error("nombre", "Escribí tu nombre y apellido.");
    if (!d.barrio) error("barrio", "Elegí tu barrio.");
    if (d.clave.length < 8) error("clave", "Usá al menos 8 caracteres.");
    else if (!/\d/.test(d.clave)) error("clave", "Sumá al menos un número.");
  });

type Registro = z.infer<typeof esquema>;

function nivelClave(c: string) {
  let n = 0;
  if (c.length >= 8) n++;
  if (/\d/.test(c)) n++;
  if (/[A-Z]/.test(c) && /[a-z]/.test(c)) n++;
  if (/[^A-Za-z0-9]/.test(c) || c.length >= 12) n++;
  return c ? Math.max(1, n) : 0;
}

const NIVELES = ["", "Débil", "Regular", "Buena", "Muy segura"];

function volverA() {
  const v = new URLSearchParams(window.location.search).get("volver");
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/perfil";
}

export function Ingresar() {
  const [modo, setModo] = useState<"ingresar" | "registro">("ingresar");
  const [ver, setVer] = useState(false);
  const router = useRouter();
  const registro = modo === "registro";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<Registro>({
    resolver: zodResolver(esquema),
    mode: "onTouched",
    defaultValues: { modo: "ingresar", correo: "", clave: "", nombre: "", barrio: "" },
  });
  const clave = useWatch({ control, name: "clave" }) ?? "";
  const nivel = nivelClave(clave);

  const enviar = async (d: Registro) => {
    await new Promise((r) => setTimeout(r, 700));
    const nombre = registro ? d.nombre : d.correo.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    acciones.ingresar({ nombre, correo: d.correo, barrio: registro ? d.barrio : "Centro" });
    toast.success(registro ? `¡Bienvenido/a, ${nombre.split(" ")[0]}!` : `Hola de nuevo, ${nombre.split(" ")[0]}`);
    router.push(volverA());
  };

  const demo = () => {
    acciones.ingresar({ nombre: "Camila Ríos", correo: "camila.rios@correo.com", barrio: "Banda Norte" });
    toast.success("Entraste con la cuenta de prueba");
    router.push(volverA());
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="pestanas !w-full" role="tablist" aria-label="Ingresar o crear cuenta">
        {(
          [
            { v: "ingresar", t: "Ingresar" },
            { v: "registro", t: "Crear cuenta" },
          ] as const
        ).map((o) => (
          <button
            key={o.v}
            type="button"
            role="tab"
            aria-selected={modo === o.v}
            className="pestana flex-1"
            onClick={() => {
              setModo(o.v);
              setValue("modo", o.v);
              clearErrors();
            }}
          >
            {modo === o.v && <motion.span layoutId="ing-tab" className="pestana-fondo" />}
            {o.t}
          </button>
        ))}
      </div>

      <motion.h1 key={modo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-h2 mt-8">
        {registro ? "Creá tu cuenta" : "Qué bueno verte"}
      </motion.h1>
      <p className="mt-2 text-ink-2">
        {registro ? "Guardá favoritos, enviá solicitudes y seguí su estado." : "Ingresá para seguir tus solicitudes y favoritos."}
      </p>

      <form onSubmit={handleSubmit(enviar)} noValidate className="mt-8 grid gap-5">
        <motion.div layout className="grid gap-5">
          {registro && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-5">
              <Campo id="nombre" etiqueta="Nombre y apellido" error={errors.nombre?.message}>
                <input className="input" autoComplete="name" {...ariaCampo("nombre", errors.nombre?.message)} {...register("nombre")} />
              </Campo>
              <Campo id="barrio" etiqueta="Barrio" error={errors.barrio?.message}>
                <select className="select" {...ariaCampo("barrio", errors.barrio?.message)} {...register("barrio")}>
                  <option value="">Elegí tu barrio</option>
                  {BARRIOS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </Campo>
            </motion.div>
          )}
          <Campo id="correo" etiqueta="Correo" error={errors.correo?.message}>
            <input className="input" type="email" autoComplete="email" {...ariaCampo("correo", errors.correo?.message)} {...register("correo")} />
          </Campo>
          <Campo
            id="clave"
            etiqueta="Contraseña"
            ayuda={registro ? "Mínimo 8 caracteres y un número." : undefined}
            error={errors.clave?.message}
          >
            <div className="grupo-input">
              <input
                className="input con-accion"
                type={ver ? "text" : "password"}
                autoComplete={registro ? "new-password" : "current-password"}
                {...ariaCampo("clave", errors.clave?.message, registro)}
                {...register("clave")}
              />
              <button type="button" className="icon-btn accion-der" onClick={() => setVer((v) => !v)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={ver}>
                {ver ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            {registro && clave && (
              <div className="flex items-center gap-3" aria-live="polite">
                <div className="medidor flex-1" data-nivel={nivel} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span className={cn("text-sm font-semibold", nivel <= 1 ? "text-danger" : nivel === 4 ? "text-success" : "text-ink-2")}>
                  {NIVELES[nivel]}
                </span>
              </div>
            )}
          </Campo>
        </motion.div>

        <button type="submit" className="btn btn-primario btn-lg mt-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          ) : registro ? (
            <UserPlus className="size-5" aria-hidden="true" />
          ) : (
            <LogIn className="size-5" aria-hidden="true" />
          )}
          {isSubmitting ? "Un momento…" : registro ? "Crear cuenta" : "Ingresar"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-sm text-ink-2" aria-hidden="true">
        <span className="h-px flex-1 bg-line" /> o <span className="h-px flex-1 bg-line" />
      </div>
      <button type="button" className="btn btn-neutro btn-bloque" onClick={demo}>
        <Zap className="size-5 text-brand" aria-hidden="true" /> Entrar con la cuenta de prueba
      </button>
      <p className="mt-6 text-center text-sm text-ink-2">
        Es una demo: no se envían datos a ningún servidor, todo queda en tu navegador.
      </p>
    </div>
  );
}
