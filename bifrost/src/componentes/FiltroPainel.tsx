"use client";

import { Input } from "@/componentes/ui/Input";
import { Botao } from "@/componentes/ui/Botao";
import magGlass from "../../public/magGlass.svg";

interface CampoOption {
  value: string;
  label: string;
}

interface FiltroPainelProps {
  searchField: string;
  onChangeSearchField: (value: string) => void;

  searchValue: string;
  onChangeSearchValue: (value: string) => void;

  campos: CampoOption[];

  onNovo: () => void;
  textoBotaoNovo: string;
}

export default function FiltroPainel({
  searchField,
  onChangeSearchField,
  searchValue,
  onChangeSearchValue,
  campos,
  onNovo,
  textoBotaoNovo,
}: FiltroPainelProps) {
  const campoSelecionado = campos.find((campo) => campo.value === searchField);

  return (
    <div className="flex items-end gap-2 mb-4 self-end">
      <select
        value={searchField}
        onChange={(e) => onChangeSearchField(e.target.value)}
        className="rounded px-2 py-1 text-sm"
      >
        {campos.map((campo) => (
          <option key={campo.value} value={campo.value}>
            {campo.label}
          </option>
        ))}
      </select>

      <Input
        type="text"
        label={`Buscar por ${campoSelecionado?.label || ''}...`}
        bgColor="bg-transparent"
        variant="default"
        onChange={(e) => onChangeSearchValue(e.target.value)}
        icon={magGlass}
        value={searchValue}
      />

      <Botao texto={textoBotaoNovo} bgColor="bg-verde" onClick={onNovo} />
    </div>
  );
}
