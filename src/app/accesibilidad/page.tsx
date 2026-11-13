import type { Metadata } from "next";
import Link from "next/link";
import { Contrast, Ear, Focus, Hand, ImageIcon, Keyboard, Palette, Wind } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer, Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { AjustesRapidos } from "@/components/comunidad/AjustesRapidos";

export const metadata: Metadata = { title: "Accesibilidad", description: "Cómo hicimos AdoptApp para que la pueda usar todo el mundo." };

const ATAJOS = [
  ["Tab / Shift + Tab", "Moverte entre enlaces, botones y campos"],
  ["Enter o Espacio", "Activar botones, chips e interruptores"],
  ["Esc", "Cerrar menús, ventanas y paneles"],
  ["← →", "Mover carruseles y el hero cuando tienen el foco"],
  ["→ en Descubrir", "Me gusta"],
  ["← en Descubrir", "Paso"],
  ["Retroceso en Descubrir", "Deshacer la última decisión"],
];

export default function PaginaAccesibilidad() {
  return (
    <>
      <Cabecera
        foto="/img/banners/accesibilidad.jpg"
        antetitulo="Accesibilidad"
        titulo="Una app para todas las personas."
        resaltar={["todas"]}
        bajada="Seguimos las pautas WCAG 2.2 nivel AA. Si algo no te funciona, contanos y lo arreglamos."
        migas={[{ texto: "Accesibilidad" }]}
      />
      <section className="seccion" aria-labelledby="t-aj">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <EncabezadoSeccion id="t-aj" antetitulo="Ajustes rápidos" titulo="Adaptala a vos, ahora." bajada="Se guardan en este dispositivo. También están en Ajustes." />
          <Aparecer>
            <AjustesRapidos />
          </Aparecer>
        </div>
      </section>
      <section className="seccion seccion-crema" aria-labelledby="t-hic">
        <div className="contenedor">
          <EncabezadoSeccion id="t-hic" antetitulo="Qué hicimos" titulo="Accesible desde el diseño, no como parche." />
          <Escalonado className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Contrast, t: "Contraste AA", s: "Textos y botones con contraste mínimo de 4,5:1, en claro y oscuro." },
              { i: Focus, t: "Foco visible", s: "Un contorno naranja de 3 px te muestra siempre dónde estás." },
              { i: Keyboard, t: "Todo con teclado", s: "Menús, carruseles, formularios y Descubrir funcionan sin mouse." },
              { i: Ear, t: "Lector de pantalla", s: "Botones con nombre, regiones con título y avisos en vivo." },
              { i: ImageIcon, t: "Textos alternativos", s: "Cada foto de mascota describe cómo es el animal." },
              { i: Palette, t: "No solo color", s: "Los estados combinan color, ícono y texto." },
              { i: Hand, t: "Objetivos de 44 px", s: "Botones grandes, fáciles de tocar con el dedo." },
              { i: Wind, t: "Movimiento opcional", s: "Respetamos “reducir movimiento” del sistema y de la app." },
            ].map((x) => (
              <ItemEscalonado key={x.t} className="tarjeta p-6">
                <span className="icono-modal">
                  <x.i className="size-6" aria-hidden="true" />
                </span>
                <h3 className="t-h4 mt-4">{x.t}</h3>
                <p className="mt-1 text-ink-2">{x.s}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>
      <section className="seccion" aria-labelledby="t-atajos">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <EncabezadoSeccion id="t-atajos" antetitulo="Teclado" titulo="Atajos útiles." />
          <Aparecer className="tabla-wrap">
            <table className="tabla !min-w-0">
              <caption className="sr-only">Atajos de teclado</caption>
              <thead>
                <tr>
                  <th scope="col">Tecla</th>
                  <th scope="col">Qué hace</th>
                </tr>
              </thead>
              <tbody>
                {ATAJOS.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row" className="!w-56">
                      <span className="kbd !text-ink">{k}</span>
                    </th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Aparecer>
        </div>
        <div className="contenedor mt-12">
          <p className="alerta alerta-info">
            <span>
              ¿Encontraste una barrera? <Link href="/contacto">Escribinos</Link> eligiendo el motivo “Accesibilidad”. Respondemos en 48 h.
            </span>
          </p>
        </div>
      </section>
    </>
  );
}
