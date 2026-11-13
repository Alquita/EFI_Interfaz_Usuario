"use client";

import * as Switch from "@radix-ui/react-switch";
import { Check, Moon, Type, Wind } from "lucide-react";
import { acciones, useEstado } from "@/lib/store";
import { cambiarTemaAnimado, useTemaOscuro } from "@/components/sitio/BotonTema";

/** Interruptores de accesibilidad a mano en la página de Accesibilidad */
export function AjustesRapidos() {
  const { ajustes } = useEstado();
  const oscuro = useTemaOscuro();
  const filas = [
    { id: "ar-oscuro", t: "Modo oscuro", s: "Fondo negro y alto contraste", i: Moon, v: oscuro, f: (v: boolean) => cambiarTemaAnimado(v, undefined, ajustes.reducirMovimiento) },
    { id: "ar-texto", t: "Texto más grande", s: "Agranda todo un 25 %", i: Type, v: ajustes.textoGrande, f: (v: boolean) => acciones.cambiarAjuste("textoGrande", v) },
    { id: "ar-mov", t: "Reducir movimiento", s: "Sin carruseles automáticos ni parallax", i: Wind, v: ajustes.reducirMovimiento, f: (v: boolean) => acciones.cambiarAjuste("reducirMovimiento", v) },
  ];
  return (
    <div className="grupo-lista">
      {filas.map((x) => (
        <div key={x.id} className="fila-switch px-5">
          <span className="icono-menu">
            <x.i className="size-5" aria-hidden="true" />
          </span>
          <label htmlFor={x.id} className="flex-1 cursor-pointer">
            <span className="block font-semibold">{x.t}</span>
            <span className="ayuda block">{x.s}</span>
          </label>
          <Switch.Root id={x.id} className="switch" checked={x.v} onCheckedChange={x.f}>
            <Switch.Thumb className="switch-thumb">
              <Check className="size-3.5" strokeWidth={3} />
            </Switch.Thumb>
          </Switch.Root>
        </div>
      ))}
    </div>
  );
}
