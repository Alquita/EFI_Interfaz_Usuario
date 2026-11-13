import type { Metadata } from "next";
import { BellRing, ClipboardList, LayoutDashboard, MapPinned, Megaphone, ShieldCheck } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { FormularioSimple } from "@/components/ui/FormularioSimple";

export const metadata: Metadata = {
  title: "Sumar tu refugio",
  description: "AdoptApp es gratis para refugios y rescatistas de Río Cuarto: publicá, recibí solicitudes ordenadas y aparecé en el mapa.",
};

export default function PaginaSumar() {
  return (
    <>
      <Cabecera
        foto="/img/varios/voluntaria.jpg"
        antetitulo="Para refugios y rescatistas"
        titulo="Menos mensajes perdidos, más adopciones."
        resaltar={["más", "adopciones."]}
        bajada="Publicá a tus animales, recibí solicitudes ordenadas y aparecé en el mapa de la ciudad. Gratis."
        migas={[{ texto: "Sumar tu refugio" }]}
      />
      <section className="seccion" aria-labelledby="t-ben">
        <div className="contenedor">
          <EncabezadoSeccion id="t-ben" antetitulo="Qué ganás" titulo="Todo lo que hoy hacés por WhatsApp, ordenado." />
          <Escalonado className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: ClipboardList, t: "Solicitudes completas", s: "Llegan con datos de la familia, vivienda y rutina. Sin preguntar cinco veces." },
              { i: LayoutDashboard, t: "Estados claros", s: "Marcás en revisión, aprobada o rechazada, y la familia se entera sola." },
              { i: MapPinned, t: "En el mapa", s: "Tus horarios, teléfono y cómo llegar, a la vista de toda la ciudad." },
              { i: Megaphone, t: "Más alcance", s: "Tus animales aparecen en el catálogo, Descubrir y el boletín semanal." },
              { i: BellRing, t: "Necesidades", s: "Publicás qué te falta y la comunidad dona alimento o insumos." },
              { i: ShieldCheck, t: "Sello de confianza", s: "Las publicaciones de particulares pasan por tu revisión." },
            ].map((x) => (
              <ItemEscalonado key={x.t} className="tarjeta eleva p-6">
                <span className="icono-modal">
                  <x.i className="size-6" aria-hidden="true" />
                </span>
                <h3 className="t-h4 mt-5">{x.t}</h3>
                <p className="mt-2 text-ink-2">{x.s}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>
      <section className="seccion seccion-crema" aria-labelledby="t-form-ref">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <EncabezadoSeccion id="t-form-ref" antetitulo="Sumate" titulo="Contanos de tu refugio." bajada="Te contactamos para conocerlos y darles acceso para publicar." />
          <div className="tarjeta p-6 md:p-8">
            <FormularioSimple
              boton="Enviar solicitud"
              exito={{ titulo: "¡Recibimos sus datos!", texto: "Les escribimos en 48 h para coordinar una charla." }}
              campos={[
                { id: "refugio", etiqueta: "Nombre del refugio o grupo", tipo: "text", requerido: true },
                { id: "responsable", etiqueta: "Persona responsable", tipo: "text", requerido: true, medio: true, autocompletar: "name" },
                { id: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true, medio: true },
                { id: "correo", etiqueta: "Correo", tipo: "email", requerido: true, medio: true },
                { id: "cantidad", etiqueta: "Animales en adopción hoy", tipo: "number", requerido: true, medio: true },
                { id: "especies", etiqueta: "Trabajan con", tipo: "chips", opciones: ["Perros", "Gatos", "Cachorros", "Seniors"], requerido: true },
                { id: "contanos", etiqueta: "Contanos cómo trabajan", tipo: "textarea", min: 30, requerido: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
