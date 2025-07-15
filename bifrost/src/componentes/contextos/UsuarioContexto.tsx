"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ehAdmin: boolean;
}

interface UsuarioContextoProps {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

export const UsuarioContexto = createContext<UsuarioContextoProps | undefined>(undefined);

export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          router.push("/painel/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.usuario) {
          setUsuario(data.usuario);
        }
      });
  }, [router]);

  return (
    <UsuarioContexto.Provider value={{ usuario, setUsuario }}>
      {children}
    </UsuarioContexto.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContexto);
  if (!context) {
    throw new Error("useUsuario precisa estar dentro de UsuarioProvider");
  }
  return context;
}
