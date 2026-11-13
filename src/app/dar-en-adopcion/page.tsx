import type { Metadata } from "next";
import { Camera, ClipboardCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { DarEnAdopcion } from "@/components/comunidad/DarEnAdopcion";
import { Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";

export const metadata: Metadata = {
  title: "Dar en adopción",
  description: "Publicá de forma segura un perro o gato que necesita hogar. Un refugio aliado revisa la publicación.",
};

export default function PaginaDar() {
  return (
    <>
      <Cabecera
        foto="/img/varios/perro-gato.jpg"
        antetitulo="Dar en adopción"
        titulo="Publicalo seguro, con ayuda de un refugio."
        resaltar={["seguro,"]}
        bajada="Completá la ficha en 5 minutos. Un refugio aliado revisa los datos y te ayuda a elegir a la familia."
        migas={[{ texto: "Dar en adopción" }]}
      />
      <div className="contenedor grid gap-10 py-14 lg:grid-cols-[1fr_20rem] lg:py-20">
        <DarEnAdopcion />
        <aside className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <div className="panel-marca p-6">
            <h2 className="t-h4">Cómo sigue</h2>
            <Escalonado como="ol" className="mt-4 grid gap-4">
              {[
                { i: ClipboardCheck, t: "Revisión", s: "Un refugio chequea datos y fotos en 48 h." },
                { i: ShieldCheck, t: "Publicación", s: "Sale en el catálogo con el sello del refugio." },
                { i: MessageCircle, t: "Solicitudes", s: "Las recibe el refugio y te ayuda a elegir." },
              ].map((x, n) => (
                <ItemEscalonado key={x.t} como="li" className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent font-bold text-white">{n + 1}</span>
                  <span>
                    <span className="block font-semibold">{x.t}</span>
                    <span className="text-sm text-ink-2">{x.s}</span>
                  </span>
                </ItemEscalonado>
              ))}
            </Escalonado>
          </div>
          <div className="tarjeta p-6">
            <h2 className="t-h4 flex items-center gap-2">
              <Camera className="size-5 text-brand" aria-hidden="true" /> Fotos que adoptan
            </h2>
            <ul className="mt-3 grid gap-2 text-[0.9375rem] text-ink-2">
              <li>• Luz natural, sin flash.</li>
              <li>• A la altura de sus ojos.</li>
              <li>• Una de cuerpo entero y una de la cara.</li>
              <li>• Fondo limpio, sin rejas si se puede.</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
