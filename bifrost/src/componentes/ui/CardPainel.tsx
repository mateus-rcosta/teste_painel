import { useEffect, useRef } from "react";
import { Botao } from "./Botao";

interface CardPainelProps {
  titulo: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  textoConfirmar?: string;
  textoCancelar?: string;
  onClose: () => void; 
}

export const CardPainel = ({
  titulo,
  children,
  onConfirm,
  onCancel,
  textoConfirmar = 'Salvar',
  textoCancelar = 'Cancelar',
  onClose,
}: CardPainelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClose]);

  return (
    <div
      ref={ref}
      className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[80%] md:max-w-[60%] lg:max-w-[40%] bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 shadow-lg transition-transform duration-300"
    >
      <h2 className="text-xl font-bold">{titulo}</h2>
      <div className="flex flex-col gap-4">{children}</div>
      <div className="flex justify-end gap-4">
        <Botao texto={textoCancelar} variante="default" onClick={onCancel} bgColor="bg-vermelho" textColor="text-white" />
        <Botao texto={textoConfirmar} variante="default" onClick={onConfirm} bgColor="bg-verde" textColor="text-white" />
      </div>
    </div>
  );
};