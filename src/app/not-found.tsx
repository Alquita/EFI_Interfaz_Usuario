import Link from "next/link";
import { Huella } from "@/components/ui/Marca";

export default function NoEncontrado() {
  return (
    <div className="contenedor grid min-h-[70dvh] place-items-center py-20 text-center">
      <div>
        <div className="relative mx-auto h-16 w-64" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Huella
              key={i}
              className="absolute top-0 size-9 text-brand-deco"
              style={{
                left: `${i * 48}px`,
                top: i % 2 ? "22px" : "0px",
                animation: `irse 3.2s var(--ease-out) ${i * 0.35}s infinite both`,
              }}
            />
          ))}
        </div>
        <p className="mt-8 text-[7rem] font-black leading-none tracking-tighter text-brand md:text-[10rem]">404</p>
        <h1 className="t-h2 mt-2">Esta página se fue a pasear.</h1>
        <p className="t-lead mx-auto mt-3 max-w-md">Puede que el enlace esté mal o que la mascota ya haya encontrado familia.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primario btn-lg">
            Volver al inicio
          </Link>
          <Link href="/#mascotas" className="btn btn-secundario btn-lg">
            Ver mascotas
          </Link>
        </div>
      </div>
    </div>
  );
}
