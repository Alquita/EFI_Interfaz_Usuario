import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";
import { LISTA_REFUGIOS } from "@/data/refugios";
import { Cabecera } from "@/components/ui/Cabecera";
import { Aparecer } from "@/components/ui/Movimiento";
import { FormularioSimple } from "@/components/ui/FormularioSimple";
import { IconoWhatsapp } from "@/components/ui/Marca";

export const metadata: Metadata = { title: "Contacto", description: "Escribile al equipo de AdoptApp o a los refugios aliados." };

export default function PaginaContacto() {
  return (
    <>
      <Cabecera
        foto="/img/banners/contacto.jpg"
        antetitulo="Contacto"
        titulo="Hablemos."
        resaltar={["Hablemos."]}
        bajada="Respondemos en el día, de lunes a sábado. Para urgencias de un animal, llamá directo al refugio."
        migas={[{ texto: "Contacto" }]}
      />
      <section className="contenedor grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        <div className="tarjeta p-6 md:p-8">
          <h2 className="t-h3 mb-6">Mandanos un mensaje</h2>
          <FormularioSimple
            boton="Enviar mensaje"
            exito={{ titulo: "¡Mensaje enviado!", texto: "Te respondemos al correo que dejaste, en el día." }}
            campos={[
              { id: "nombre", etiqueta: "Nombre", tipo: "text", requerido: true, medio: true, autocompletar: "name" },
              { id: "correo", etiqueta: "Correo", tipo: "email", requerido: true, medio: true, autocompletar: "email" },
              { id: "motivo", etiqueta: "Motivo", tipo: "select", opciones: ["Consulta sobre una adopción", "Problema con mi cuenta", "Accesibilidad", "Prensa o alianzas", "Borrar mi cuenta", "Otro"], requerido: true },
              { id: "mensaje", etiqueta: "Mensaje", tipo: "textarea", requerido: true, min: 20 },
            ]}
          />
        </div>
        <div className="grid content-start gap-5">
          <Aparecer className="panel-marron p-6">
            <p className="t-h4">AdoptApp</p>
            <ul className="mt-4 grid gap-3">
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-[#fdba74]" aria-hidden="true" /> hola@adoptapp.ejemplo
              </li>
              <li className="flex items-center gap-3">
                <IconoWhatsapp className="size-5 text-[#fdba74]" /> 358 400 0000 (ejemplo)
              </li>
              <li className="flex items-center gap-3">
                <Clock className="size-5 text-[#fdba74]" aria-hidden="true" /> Lun. a sáb. de 9 a 19 h
              </li>
            </ul>
          </Aparecer>
          {LISTA_REFUGIOS.map((r, i) => (
            <Aparecer key={r.id} retraso={0.08 * (i + 1)} className="tarjeta flex items-center gap-4 p-5">
              <div className="flex-1">
                <p className="font-semibold">{r.nombre}</p>
                <p className="text-sm text-ink-2">{r.horario}</p>
              </div>
              <a href={`tel:${r.telefono.replace(/\s/g, "")}`} className="btn btn-secundario btn-sm">
                <Phone className="size-4" aria-hidden="true" /> {r.telefono}
              </a>
            </Aparecer>
          ))}
        </div>
      </section>
    </>
  );
}
