'use client';


import { ReactNode } from 'react';

interface TabelaPainelProps<T> {
  dados: T[];
  renderStatus: (item: T) => ReactNode;
  renderConteudo: (item: T) => ReactNode;
  renderAcoes: (item: T) => ReactNode;
}

export default function TabelaPainel<T> ({
  dados,
  renderStatus,
  renderConteudo,
  renderAcoes,
}: TabelaPainelProps<T>) {
  return (
    <table className='w-full'>
      <thead className='w-full'>
        <tr className='text-left w-full'>
          <th className='p-2 border-b'></th>
          <th className='p-2 border-b'>Informações</th>
          <th className='p-2 border-b'>Ações</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((item, index) => (
          <tr key={index} className='border-b'>
            <td className='p-2 border-b'>{renderStatus(item)}</td>
            <td className='p-2 border-b'>{renderConteudo(item)}</td>
            <td className='p-2 border-b'>{renderAcoes(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}