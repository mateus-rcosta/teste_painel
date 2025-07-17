'use client';
import { useEffect, useState } from 'react';
import { CardPainel } from './ui/CardPainel';
import { Input } from './ui/Input';
import Toggle from './ui/Toggle';

interface CardUsuarioFormProps {
  dados?: {
    nome?: string;
    email?: string;
    ehAdmin?: boolean;
  };
  usuarioId?: string;
  modo: "criar" | "editar" | "excluir";
  onConfirm: (valores: { nome: string; email: string; senha?: string; ehAdmin?: boolean }) => void;
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
  const [ehAdmin, setEhAdmin] = useState<boolean>(dados?.ehAdmin || false);
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modo === "editar" && usuarioId) {
      fetch(`/api/admin/usuarios/${usuarioId}`)
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome || "");
          setEmail(data.email || "");
          setEhAdmin(data.ehAdmin || false);
        })
        .catch((error) => {
          console.error('Erro ao carregar usuário:', error);
        });
    }
  }, [modo, usuarioId]);

  const validar = () => {
    const campos: Record<string, string> = {};

    if (!nome.trim()) campos.nome = "Nome é obrigatório.";

    if (modo === 'criar') {
      if (!email.trim()) campos.email = "E-mail é obrigatório.";
    }

    if (modo === 'criar') {
      if (!senha.trim()) campos.senha = "Senha é obrigatória.";
      else if (senha.trim().length < 8) campos.senha = "Senha deve ter no mínimo 8 caracteres.";
    }

    if (modo === 'editar' && senha.trim() && senha.trim().length < 8) {
      campos.senha = "Senha deve ter no mínimo 8 caracteres.";
    }

    return campos;
  };

  const handleConfirm = () => {
    const validacao = validar();
    if (Object.keys(validacao).length > 0) {
      setErros(validacao);
      return;
    }
    setErros({});
    onConfirm({
      nome: nome.trim(),
      email: modo === 'criar' ? email.trim().toLowerCase() : email, // no editar mantém igual
      senha: senha.trim() || undefined,
      ehAdmin
    });
  };

  const titulo =
    modo === 'criar'
      ? 'Criar Usuário'
      : modo === 'editar'
        ? `Editar Usuário`
        : `Excluir Usuário`;

  return (
    <CardPainel
      titulo={titulo}
      onConfirm={modo === 'excluir'
        ? () => onConfirm({ nome: '', email: '' })
        : handleConfirm
      }
      onCancel={onClose}
      onClose={onClose}
    >
      {modo === 'excluir' ? (
        <p className="text-center">Tem certeza que deseja excluir este usuário?</p>
      ) : (
        <>
          <Input
            variant="default"
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {erros.nome && <p className="text-vermelho text-xs">{erros.nome}</p>}

          <Input
            variant="default"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={modo === 'editar'}
          />
          {modo === 'criar' && erros.email && (
            <p className="text-vermelho text-xs">{erros.email}</p>
          )}

          <Input
            variant="default"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={modo === 'criar'}
          />
          {erros.senha && <p className="text-vermelho text-xs">{erros.senha}</p>}

          <div className="flex flex-row gap-2 items-center mt-2">
            <span>Administrador</span>
            <Toggle
              checked={ehAdmin}
              onChange={() => setEhAdmin(!ehAdmin)}
            />
          </div>
        </>
      )}
    </CardPainel>
  );
};
