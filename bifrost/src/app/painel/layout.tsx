import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel',
};

export default function PainelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}