'use client';

import { useEffect, useState } from 'react';
import { CardPainel } from './ui/CardPainel';
import { Input } from './ui/Input';

interface CardUrlFormProps {
  dados?: {
    nome?: string;
    target?: string;
    utms?: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    };
  };
  modo: "criar" | "editar" | "excluir";
  urlId?: string;

  onConfirm: (valores: {
    nome?: string;
    target?: string;
    utms?: {
      source?: string;
      medium?: string;
      campaign?: string;
      term?: string;
      content?: string;
    };
  }) => void;

  onClose: () => void;
}

export const CardUrlForm = ({
  dados,
  modo,
  onConfirm,
  onClose,
  urlId,
}: CardUrlFormProps) => {
  const [nome, setNome] = useState(dados?.nome || '');
  const [target, setTarget] = useState(dados?.target || '');
  const [source, setSource] = useState(dados?.utms?.source || '');
  const [medium, setMedium] = useState(dados?.utms?.medium || '');
  const [campaign, setCampaign] = useState(dados?.utms?.campaign || '');
  const [term, setTerm] = useState(dados?.utms?.term || '');
  const [content, setContent] = useState(dados?.utms?.content || '');
  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (modo === "editar" && urlId) {
      fetch(`/api/urls/${urlId}`)
        .then((res) => res.json())
        .then((data) => {
          setNome(data.nome || "");
          setTarget(data.target || "");
          setSource(data.utms?.source || "");
          setMedium(data.utms?.medium || "");
          setCampaign(data.utms?.campaign || "");
          setTerm(data.utms?.term || "");
          setContent(data.utms?.content || "");
        });
    }
  }, [modo, urlId]);

  const validar = () => {
    const campos: Record<string, string> = {};

    if (!nome.trim()) campos.nome = "Nome é obrigatório.";
    if (!target.trim()) campos.target = "Target é obrigatório.";
    if (!target.trim().startsWith('https://') && !target.trim().startsWith('http://')) {
      campos.target = "Target deve começar com http:// ou https://";
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
      target: target.trim(),
      utms: {
        source: source.trim() || undefined,
        medium: medium.trim() || undefined,
        campaign: campaign.trim() || undefined,
        term: term.trim() || undefined,
        content: content.trim() || undefined,
      },
    });
  };

  const titulo =
    modo === 'criar'
      ? 'Criar URL'
      : modo === 'editar'
        ? `Editar URL`
        : `Excluir URL`;

  return (
    <CardPainel
      titulo={titulo}
      onConfirm={modo === 'excluir' ? () => onConfirm({}) : handleConfirm}
      onCancel={onClose}
      onClose={onClose}
    >
      {modo === 'excluir' ? (
        <p className="text-center">Tem certeza que deseja excluir esta URL?</p>
      ) : (
        <>
          <Input
            variant="default"
            label='Nome'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          {erros.nome && <p className="text-vermelho text-xs">{erros.nome}</p>}

          <Input
            variant="default"
            label='Target'
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
          {erros.target && <p className="text-vermelho text-xs">{erros.target}</p>}

          <Input
            variant="default"
            label='Origem'
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <Input
            variant="default"
            value={medium}
            label='Meio'
            onChange={(e) => setMedium(e.target.value)}
          />
          <Input
            variant="default"
            label='Campanha'
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          />
          <Input
            variant="default"
            label='Termo'
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <Input
            variant="default"
            label='Conteúdo'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </>
      )}
    </CardPainel>
  );
};
