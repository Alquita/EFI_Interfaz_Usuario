import type { Metadata } from "next";
import Image from "next/image";
import { CircleCheck } from "lucide-react";
import { Ingresar } from "@/components/cuenta/Ingresar";
import { Aparecer } from "@/components/ui/Movimiento";

export const metadata: Metadata = { title: "Ingresar" };

export default function PaginaIngresar() {
  return (
    <div className="contenedor grid min-h-[calc(100dvh-var(--header-h))] items-center gap-12 py-10 lg:grid-cols-2">
      <Aparecer desde="izquierda" className="relative hidden h-full max-h-[46rem] overflow-hidden rounded-[2rem] lg:block">
        <Image src="/img/varios/login.jpg" alt="Perro blanco de pelo esponjoso sonriendo en la vereda" fill sizes="50vw" className="ken-burns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white">
          <p className="t-h2">Copito te está esperando.</p>
          <ul className="mt-5 grid gap-2 text-white/90">
            {["Guardá favoritos y comparalos", "Solicitud en 3 pasos", "Seguí el estado sin llamar cinco veces"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CircleCheck className="size-5 text-[#86efac]" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </Aparecer>
      <Ingresar />
    </div>
  );
}
