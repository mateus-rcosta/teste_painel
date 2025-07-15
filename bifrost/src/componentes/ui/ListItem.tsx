import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';

// Props comuns
type CommonProps = {
  children: ReactNode;
  className?: string;
  selecionado?: boolean;
  corPrimaria?: string;
  corSecundaria?: string;
};

// Anchor
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;
function Anchor({
  children,
  selecionado = false,
  corPrimaria = 'var(--azul-escuro)',
  corSecundaria = 'var(--azul)',
  className = '',
  ...rest
}: AnchorProps) {
  return (
    <li>
      <a
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition 
          ${selecionado ? `bg-[${corPrimaria}] text-white` : `hover:bg-[${corSecundaria}]`}
          ${className}`}
        {...rest}
      >
        {children}
      </a>
    </li>
  );
}

// Button
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
function Button({
  children,
  selecionado = false,
  corPrimaria = 'var(--azul-escuro)',
  corSecundaria = 'var(--azul)',
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <li>
      <button
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition 
          ${selecionado ? `bg-[${corPrimaria}] text-white` : `hover:bg-[${corSecundaria}]`}
          ${className}`}
        {...rest}
      >
        {children}
      </button>
    </li>
  );
}

// Text
type TextProps = CommonProps & HTMLAttributes<HTMLSpanElement>;
function Text({
  children,
  selecionado = false,
  corPrimaria = 'var(--azul-escuro)',
  corSecundaria = 'var(--azul)',
  className = '',
  ...rest
}: TextProps) {
  return (
    <li>
      <span
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition 
          ${selecionado ? `bg-[${corPrimaria}] text-white` : `hover:bg-[${corSecundaria}]`}
          ${className}`}
        {...rest}
      >
        {children}
      </span>
    </li>
  );
}

// Componente raiz (não precisa renderizar nada)
export const ListItem = { Anchor, Button, Text };