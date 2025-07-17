"use client";

import Image from 'next/image';
import { InputHTMLAttributes, useState, useEffect } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant: 'default' | 'filled' | 'outlined';
  tamanho?: 'sm' | 'md' | 'lg';
  icon?: string;
  bgColor?: 'bg-azul' | 'bg-vermelho' | 'bg-verde' | 'bg-white' | 'bg-black' | 'bg-transparent';
  textColor?: 'text-azul' | 'text-vermelho' | 'text-verde' | 'text-white' | 'text-black';
  borderColor?: 'border-azul' | 'border-vermelho' | 'border-verde' | 'border-white' | 'border-black' | 'border-transparent';
  alt?: string;
}

export const Input = ({
  label,
  variant,
  bgColor = 'bg-white',
  textColor = 'text-black',
  borderColor = 'border-black',
  tamanho = 'md',
  icon,
  alt,
  value,
  onChange,
  ...rest
}: InputProps) => {

  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    if (value && String(value).trim() !== '') {
      setHasValue(true);
    } else {
      setHasValue(false);
    }
  }, [value]);

  const tamanhoClass =
    tamanho === 'sm'
      ? 'h-8 px-2 text-sm'
      : tamanho === 'md'
      ? 'h-10 px-3 text-base'
      : 'h-12 px-4 text-lg';

  const containerClasses = {
    default: `border-b-2 ${borderColor}`,
    filled: `${bgColor}`,
    outlined: `border-2 ${borderColor}`,
  };

  const wrapperClasses = `relative ${containerClasses[variant]} ${textColor} w-full`;

  const inputClasses = `bg-transparent w-full ${textColor} ${tamanhoClass} border-none focus:outline-none ${icon ? 'pl-6' : ''}`;

  const labelBaseClasses = `
    absolute pointer-events-none transition-all duration-200
    bg-transparent text-gray-600 
  `;

  const labelPosition = isFocused || hasValue
    ? 'text-xs -top-3 bg-transparent px-2'
    : `text-base top-1/2 transform -translate-y-1/2 ${icon ? 'pl-6' : ''}`;

  return (
    <div className={wrapperClasses}>
      {icon && (
        <Image
          width={16}
          height={16}
          src={icon}
          alt={alt || 'Ícone input'}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 mr-4"
        />
      )}
      {label && (
        <label className={`${labelBaseClasses} ${labelPosition}`}>
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </div>
  );
}
