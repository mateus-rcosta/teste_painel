import { UsuarioProvider } from '@/componentes/contextos/UsuarioContexto';
import { Navbar } from '@/componentes/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel',
};

export default function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <UsuarioProvider>
      <Navbar/>
      {children}
    </UsuarioProvider>
  );
}