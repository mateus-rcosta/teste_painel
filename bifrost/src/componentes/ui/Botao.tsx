import { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

export interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ehLink?: boolean;
  href?: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
  variante?: 'default' | 'outline' | 'seletor' | 'texto';
  tamanho?: 'sm' | 'md' | 'lg';
  bgColor?: 'bg-azul' | 'bg-verde' | 'bg-vermelho' | 'bg-transparent';
  textColor?: 'text-azul' | 'text-verde' | 'text-vermelho' | 'text-transparent' | 'text-white' | 'text-black';
  hoverColor?: 'azul' | 'verde' | 'vermelho' | 'transparent' | 'white' | 'black';
  borderColor?: 'border-azul' | 'border-verde' | 'border-vermelho' | 'border-transparent';
  texto: string;
  className?: string;
}

export const Botao = ({
  ehLink,
  href,
  target,
  variante = 'default',
  tamanho = 'md',
  bgColor = 'bg-azul',
  textColor = 'text-white',
  borderColor = 'border-transparent',
  hoverColor = 'vermelho',
  texto,
  className = '',
  ...rest
}: BotaoProps) => {

  const isLink = ehLink ?? !!href;

  const tamanhoClasses =
    tamanho === 'sm'
      ? 'px-2 py-1 text-sm shadow-sm'
      : tamanho === 'md'
      ? 'px-4 py-2 text-base shadow-base'
      : 'px-6 py-3 text-lg shadow-lg';

  if(variante === 'texto'){
    return(
      <button className={`${tamanho} px-0 py-0 shadow-none bg-none border-none cursor-pointer `}>
        {texto}
      </button>
    );
  };
  const varianteClasses =
    variante === 'default'
      ? `${bgColor}`
      : variante === 'outline'
      ? `bg-transparent border-2 ${borderColor}`
      : variante === 'seletor'
      ? `rounded-xl`:'';

  const hoverClass = `hover:${hoverColor}`;

  const classNameFinal = [
    'flex justify-center items-center',
    tamanhoClasses,
    'rounded-lg hover:cursor-pointer hover:opacity-90 hover:scale-105 transition-transform duration-100',
    varianteClasses,
    textColor,
    hoverClass,
    'gap-2',
    className,
  ]
    .filter(Boolean)
    .join(' ');


  if (isLink && href) {
    if (href.startsWith('/')) {
      // Rota interna
      return (
        <Link href={href} target={target} className={classNameFinal}>
          {texto}
        </Link>
      );
    }
    // Link externo
    return (
      <a href={href} target={target} className={classNameFinal}>
        {texto}
      </a>
    );
  }

  return (
    <button className={classNameFinal} {...rest}>
      {texto}
    </button>
  );
}