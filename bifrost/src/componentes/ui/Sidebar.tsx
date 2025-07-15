import { ReactNode } from 'react';

interface SidebarProps {
    aberto: boolean;
    children: ReactNode;
    bgColor?: 'bg-azul' | 'bg-vermelho' | 'bg-azul-darken' | 'bg-verde-whatsapp' | 'bg-white' | 'bg-black' | 'bg-branco-background-darken';
    posicao?: 'l' | 't' | 'r' | 'b'; 
    
    sobrepor?: boolean; 
}

export const Sidebar = ({
    aberto,
    children,
    posicao = 'l',
    bgColor,
    sobrepor = true,
}: SidebarProps) => {

    const posicaoClass =
        posicao === 'l' ? 'top-0 left-0 h-full'
            : posicao === 'r' ? 'top-0 right-0 h-full'
                : posicao === 't' ? 'top-0 left-0 w-full'
                    : 'bottom-0 left-0 w-full'; 

    const translateClass =
        posicao === 'l' ? (aberto ? 'translate-x-0' : '-translate-x-full')
            : posicao === 'r' ? (aberto ? 'translate-x-0' : 'translate-x-full')
                : posicao === 't' ? (aberto ? 'translate-y-0' : '-translate-y-full')
                    : (aberto ? 'translate-y-0' : 'translate-y-full'); 

    // Define se sobrepõe ou não
    const tipoPosition = sobrepor ? 'fixed z-50' : 'relative';

    // Classes fixas
    const baseClass = 'flex flex-col gap-2 p-4 transform transition-transform duration-300';

    // Junta tudo
    const className = `${tipoPosition} ${posicaoClass} ${translateClass} ${baseClass} ${bgColor}`;

    return (
        <nav
            className={className}
        >
            {children}
        </nav>
    );
}