import type { Metadata } from "next";
import { Cabecera } from "@/components/ui/Cabecera";
import { Historias } from "@/components/comunidad/Historias";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { FormularioSimple } from "@/components/ui/FormularioSimple";
import { Aparecer, Contador } from "@/components/ui/Movimiento";

export const metadata: Metadata = {
  title: "Historias de adopción",
  description: "Familias de Río Cuarto que adoptaron con AdoptApp cuentan cómo les cambió la vida.",
};

export default function PaginaHistorias() {
  return (
    <>
      <Cabecera
        foto="/img/banners/historias.jpg"
        antetitulo="Historias reales"
        titulo="Adoptar cambia dos vidas."
        resaltar={["dos", "vidas."]}
        bajada="Familias de Río Cuarto nos cuentan cómo fue el antes y el después."
        migas={[{ texto: "Historias" }]}
        foco="50% 30%"
      />
      <section className="contenedor -mt-10 relative z-10 grid grid-cols-3 overflow-hidden rounded-[1.5rem] border border-line bg-card shadow-e2" aria-label="Logros">
        {[
          { v: 126, t: "adopciones en 2026" },
          { v: 94, s: "%", t: "siguen felices al año" },
          { v: 38, t: "seniors adoptados" },
        ].map((d, i) => (
          <Aparecer key={d.t} retraso={i * 0.08} className="border-line p-5 text-center md:p-8 [&:not(:first-child)]:border-l">
            <p className="text-3xl font-bold tracking-tight text-brand md:text-5xl">
              <Contador valor={d.v} sufijo={d.s} />
            </p>
            <p className="mt-1 text-sm text-ink-2 md:text-base">{d.t}</p>
          </Aparecer>
        ))}
      </section>
      <section className="contenedor py-16 lg:py-20" aria-label="Historias">
        <Historias />
      </section>
      <section className="seccion seccion-crema" aria-labelledby="t-tuya">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <EncabezadoSeccion
            id="t-tuya"
            antetitulo="¿Adoptaste?"
            titulo="Contanos tu historia."
            resaltar={["tu", "historia."]}
            bajada="Las historias inspiran a otras familias a adoptar. Si querés, mandanos una foto por WhatsApp después."
          />
          <div className="tarjeta p-6 md:p-8">
            <FormularioSimple
              boton="Enviar mi historia"
              exito={{ titulo: "¡Gracias por compartirla!", texto: "La leemos y te escribimos antes de publicarla." }}
              campos={[
                { id: "nombre", etiqueta: "Tu nombre", tipo: "text", requerido: true, medio: true, autocompletar: "name" },
                { id: "mascota", etiqueta: "Nombre de tu mascota", tipo: "text", requerido: true, medio: true },
                { id: "refugio", etiqueta: "¿De qué refugio?", tipo: "select", opciones: ["Refugio Huellitas", "Hogar Gatuno RC", "Patitas Río Cuarto", "Otro"], requerido: true },
                { id: "historia", etiqueta: "Tu historia", tipo: "textarea", requerido: true, min: 60, ayuda: "¿Cómo se conocieron? ¿Cómo es hoy?" },
                { id: "permiso", etiqueta: "Acepto que publiquen mi historia con mi nombre", tipo: "checkbox", requerido: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
