export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  ehAdmin: boolean;
  estaAtivo: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};