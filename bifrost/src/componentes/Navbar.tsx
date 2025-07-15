'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Sidebar } from '@/componentes/ui/Sidebar';
import { Overlay } from '@/componentes/ui/Overlay';
import { List } from '@/componentes/ui/List';
import { ListItem } from '@/componentes/ui/ListItem';
import logo from '../../public/logo-main.webp';
import { useUsuario } from './contextos/UsuarioContexto';

export function Navbar() {
  const { usuario } = useUsuario();
  const [menuAberto, setMenuAberto] = useState(false);
  return (
    <>
      <button
        onClick={() => setMenuAberto((prev) => !prev)}
        className="fixed flex place-items-center justify-center items-center w-6 h-6 px-2 py-2 top-4 left-4 z-50 bg-azul text-white rounded-md opacity-40 hover:opacity-100 hover:cursor-pointer"
      >
        ☰
      </button>

      <Overlay show={menuAberto} onClick={() => setMenuAberto(false)} />

      <Sidebar aberto={menuAberto} posicao="l" bgColor='bg-azul'>
        <nav className='flex flex-col gap-4'>
          <div className="flex justify-center mb-2">
            <Image src={logo} alt={`Logo da londrinet`} width={100} height={100} />
          </div>
          <div>
            <h3 className="text-white font-semibold">Overview</h3>
            <List direction="col" className="pl-2">
              <ListItem.Anchor href="/painel/urls" selecionado>
                {/* <Image
                    src={iconHome}
                    alt={altIconHome}
                    width={16}
                    height={16}
                  /> */}
                <span className="text-sm font-medium text-white">Urls</span>
              </ListItem.Anchor>
            </List>
          </div>
          { usuario?.ehAdmin && (
            <div>
            <h3 className="text-white font-semibold">Administrador</h3>
            <List direction="col" className="pl-2">
              <ListItem.Anchor href="/painel/usuarios">
                {/* <Image
                    src={iconLocal}
                    alt={altIconLocal}
                    width={16}
                    height={16}
                  /> */}
                <span className="text-sm font-medium text-white">Usuários</span>
              </ListItem.Anchor>
            </List>
          </div>
          )}       
        </nav>
      </Sidebar>
    </>
  );
}