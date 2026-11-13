import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { ROLES_VOLUNTARIADO } from "@/data/comunidad";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { FormularioSimple } from "@/components/ui/FormularioSimple";
import { ICONOS } from "@/components/ui/Marca";
import { BARRIOS } from "@/data/barrios";

export const metadata: Metadata = {
  title: "Voluntariado",
  description: "Sumate como voluntario/a en los refugios de Río Cuarto: paseos, fotos, traslados, difusión y más.",
};

export default function PaginaVoluntariado() {
  return (
    <>
      <Cabecera
        foto="/img/banners/voluntariado.jpg"
        antetitulo="Voluntariado"
        titulo="Tus horas también rescatan."
        resaltar={["rescatan."]}
        bajada="Elegí cómo ayudar según tu tiempo y lo que te gusta hacer. Desde 1 hora por semana."
        migas={[{ texto: "Voluntariado" }]}
      />
      <section className="seccion" aria-labelledby="t-roles">
        <div className="contenedor">
          <EncabezadoSeccion id="t-roles" antetitulo="Cómo podés ayudar" titulo="Seis formas de sumarte." />
          <Escalonado className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES_VOLUNTARIADO.map((r) => {
              const I = ICONOS[r.icono];
              return (
                <ItemEscalonado key={r.id} className="tarjeta eleva group p-6">
                  <span className="icono-modal transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <I className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="t-h4 mt-5">{r.titulo}</h3>
                  <p className="mt-2 text-ink-2">{r.texto}</p>
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm font-semibold">
                    <Clock className="size-4 text-brand" aria-hidden="true" /> {r.tiempo}
                  </p>
                </ItemEscalonado>
              );
            })}
          </Escalonado>
        </div>
      </section>
      <section className="seccion seccion-crema" aria-labelledby="t-form-vol">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <EncabezadoSeccion
            id="t-form-vol"
            antetitulo="Anotate"
            titulo="Te contactamos esta semana."
            bajada="Un refugio te escribe para coordinar una charla corta y tu primer día. No hace falta experiencia."
          />
          <div className="tarjeta p-6 md:p-8">
            <FormularioSimple
              boton="Quiero sumarme"
              exito={{ titulo: "¡Gracias por sumarte!", texto: "Un refugio te escribe en los próximos días para coordinar." }}
              campos={[
                { id: "nombre", etiqueta: "Nombre y apellido", tipo: "text", requerido: true, medio: true, autocompletar: "name" },
                { id: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true, medio: true, autocompletar: "tel" },
                { id: "correo", etiqueta: "Correo", tipo: "email", requerido: true, medio: true, autocompletar: "email" },
                { id: "barrio", etiqueta: "Barrio", tipo: "select", opciones: [...BARRIOS], requerido: true, medio: true },
                { id: "roles", etiqueta: "¿Qué te gustaría hacer?", tipo: "chips", opciones: ROLES_VOLUNTARIADO.map((r) => r.titulo), requerido: true },
                { id: "disponibilidad", etiqueta: "¿Cuándo podés?", tipo: "chips", opciones: ["Mañanas", "Tardes", "Fines de semana"] },
                { id: "mensaje", etiqueta: "Contanos algo de vos", tipo: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
