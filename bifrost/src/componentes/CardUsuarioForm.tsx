'use client';
import { useEffect, useState } from 'react';
import { CardPainel } from './ui/CardPainel';
import { Input } from './ui/Input';
import Toggle from './ui/Toggle';

interface CardUsuarioFormProps {
  dados?: {
    nome?: string;
    email?: string;
    admin?: boolean;
  };
  usuarioId?: string;
  modo: "criar" | "editar" | "excluir";
  onConfirm: (valores: { nome: string; email: string; senha?: string; admin?: boolean }) => void;
  onClose: () => void;
}

export const CardUsuarioForm = ({
  dados,
  onConfirm,
  onClose,
  modo,
  usuarioId
}: CardUsuarioFormProps) => {
  const [nome, setNome] = useState(dados?.nome || '');
  const [email, setEmail] = useState(dados?.email || '');
  const [senha, setSenha] = useState('');
  const [admin, setAdmin] = useState<boolean>(dados?.admin || false);

  useEffect(() => {
    if (modo === "editar" && usuarioId) {
      fetch(`/api/admin/usuarios/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome || "");
          setEmail(data.email || "");
          setSenha(data.senha || "");
          setAdmin(data.ehAdmin || false);
        })
        .catch((error) => {
          console.error('Erro ao carregar usuário:', error);
        });
    }
  }, [modo, usuarioId]);

  const handleConfirm = () => {
    onConfirm({
      nome,
      email,
      senha,
      admin
    });
  };

  const titulo =
    modo === 'criar'
      ? 'Criar Usuário'
      : modo === 'editar'
        ? `Editar Usuário`
        : `Excluir Usuário`;

  return (
    <>
      <CardPainel
        titulo={titulo}
        onConfirm={modo === 'excluir' ? () => onConfirm({
          nome: '',
          email: ''
        }) : handleConfirm}
        onCancel={onClose}
        onClose={onClose}
      >
        {modo === 'excluir' ? (
          <p className="text-center">Tem certeza que deseja excluir este usuário?</p>
        ) : (
          <>
            <Input
              variant="default"
              label='Nome'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              variant='default'
              label='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {modo === 'criar' && (
              <Input
                variant='default'
                label='Senha'
                type='password'
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            )}
            <div className='flex flex-row gap-2 items-center'>
              <span>Administrador</span>
              <Toggle 
                checked={admin} 
                onChange={() => setAdmin(!admin)} 
              />
            </div>
          </>
        )}
      </CardPainel>
    </>
  );
}