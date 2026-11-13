import type { Metadata } from "next";
import { Perfil } from "@/components/cuenta/Perfil";

export const metadata: Metadata = { title: "Mi perfil" };

export default function PaginaPerfil() {
  return (
    <div className="contenedor py-10 lg:py-14">
      <Perfil />
    </div>
  );
}
