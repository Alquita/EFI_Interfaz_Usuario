import type { Metadata } from "next";
import Image from "next/image";
import { CircleCheck, House, Stethoscope, Utensils } from "lucide-react";
import { Cabecera } from "@/components/ui/Cabecera";
import { EncabezadoSeccion } from "@/components/ui/Bloques";
import { Aparecer, Escalonado, ItemEscalonado } from "@/components/ui/Movimiento";
import { FormularioSimple } from "@/components/ui/FormularioSimple";
import { BARRIOS } from "@/data/barrios";

export const metadata: Metadata = {
  title: "Hogar de tránsito",
  description: "Cuidá a un perro o gato por unas semanas mientras encuentra familia. El refugio cubre alimento y veterinario.",
};

export default function PaginaTransito() {
  return (
    <>
      <Cabecera
        foto="/img/banners/transito.jpg"
        antetitulo="Hogar de tránsito"
        titulo="Un sillón prestado puede salvar una vida."
        resaltar={["salvar", "una", "vida."]}
        bajada="Cuidás a un animal unas semanas, se recupera y socializa, y el refugio le encuentra familia."
        migas={[{ texto: "Hogar de tránsito" }]}
      />
      <section className="seccion" aria-labelledby="t-como-tr">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-2">
          <Aparecer desde="izquierda" className="forma-arco relative aspect-[4/5] overflow-hidden">
            <Image src="/img/varios/transito.jpg" alt="Perro marrón envuelto en una toalla rosa mientras lo secan" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </Aparecer>
          <div>
            <EncabezadoSeccion id="t-como-tr" className="!mb-8" antetitulo="Cómo funciona" titulo="Vos ponés el amor. El refugio, todo lo demás." />
            <Escalonado como="ol" className="grid gap-5">
              {[
                ["Te anotás", "Completás el formulario y te llamamos para conocerte y ver tu casa."],
                ["Te asignan un animal", "Según tu espacio, tu tiempo y si tenés otras mascotas."],
                ["Lo cuidás", "Entre 2 y 8 semanas, con acompañamiento del refugio."],
                ["Encuentra familia", "Lo despedís sabiendo que le cambiaste la historia."],
              ].map(([t, s], i) => (
                <ItemEscalonado key={t} como="li" className="flex gap-4">
                  <span className="paso-numero !size-12 shrink-0 !text-lg">{i + 1}</span>
                  <span>
                    <span className="t-h4 block">{t}</span>
                    <span className="text-ink-2">{s}</span>
                  </span>
                </ItemEscalonado>
              ))}
            </Escalonado>
          </div>
        </div>
      </section>
      <section className="seccion seccion-crema" aria-labelledby="t-cubre">
        <div className="contenedor">
          <EncabezadoSeccion id="t-cubre" centrado antetitulo="Qué cubre el refugio" titulo="No gastás nada." />
          <Escalonado className="grid gap-5 md:grid-cols-3">
            {[
              { i: Utensils, t: "Alimento", s: "Te llevamos el balanceado que necesita, todos los meses." },
              { i: Stethoscope, t: "Veterinaria", s: "Vacunas, castración, controles y cualquier tratamiento." },
              { i: House, t: "Accesorios", s: "Cama, correa, piedras sanitarias y transportadora si hace falta." },
            ].map((x) => (
              <ItemEscalonado key={x.t} className="tarjeta p-6 text-center">
                <span className="icono-modal mx-auto">
                  <x.i className="size-6" aria-hidden="true" />
                </span>
                <h3 className="t-h4 mt-4">{x.t}</h3>
                <p className="mt-2 text-ink-2">{x.s}</p>
              </ItemEscalonado>
            ))}
          </Escalonado>
        </div>
      </section>
      <section className="seccion" aria-labelledby="t-form-tr">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <EncabezadoSeccion id="t-form-tr" className="!mb-6" antetitulo="Anotate" titulo="Ofrecé tu casa." />
            <ul className="grid gap-2">
              {["Ser mayor de 18 años", "Un espacio seguro (ventanas con red para gatos)", "Poder llevarlo al veterinario si hace falta"].map((r) => (
                <li key={r} className="flex items-center gap-2 text-ink-2">
                  <CircleCheck className="size-5 text-success" aria-hidden="true" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="tarjeta p-6 md:p-8">
            <FormularioSimple
              boton="Ofrecer mi casa"
              exito={{ titulo: "¡Gracias de corazón!", texto: "Un refugio te llama esta semana para conocerte." }}
              campos={[
                { id: "nombre", etiqueta: "Nombre y apellido", tipo: "text", requerido: true, medio: true, autocompletar: "name" },
                { id: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true, medio: true, autocompletar: "tel" },
                { id: "barrio", etiqueta: "Barrio", tipo: "select", opciones: [...BARRIOS], requerido: true, medio: true },
                { id: "vivienda", etiqueta: "Vivienda", tipo: "select", opciones: ["Departamento", "Casa sin patio", "Casa con patio"], requerido: true, medio: true },
                { id: "puede", etiqueta: "Puedo recibir", tipo: "chips", opciones: ["Perros", "Gatos", "Cachorros", "Seniors", "En recuperación"], requerido: true },
                { id: "tiempo", etiqueta: "¿Por cuánto tiempo?", tipo: "select", opciones: ["2 semanas", "1 mes", "2 meses o más"], requerido: true },
                { id: "mensaje", etiqueta: "¿Algo más que debamos saber?", tipo: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
