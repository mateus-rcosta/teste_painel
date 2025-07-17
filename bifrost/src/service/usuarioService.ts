import { prisma } from '@/lib/prisma';
import { gerarHash, compararHash } from '@/lib/bcrypt';
import { validarUuid } from '@/lib/validar';
import { ForbiddenError, NotFoundError, ValidationError } from '@/erro/errorHandling';
import {
  softDeleteUsuarioRaw,
  alterarStatusRaw,
  atualizarUsuarioRaw
} from '@/repository/usuarioRepository';

// procurar usuario por id
export async function retornarUsuarioPorId(id: string) {
  const usuario = await prisma.usuario.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      nome: true,
      email: true,
      ehAdmin: true,
      estaAtivo: true,
    },
  });

  if (!usuario) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return usuario;
}

// criar usuario
export async function criarUsuario(dados: {
  nome: string;
  email: string;
  senha: string;
  ehAdmin?: boolean;
}) {
  const senhaCriptografada = await gerarHash(dados.senha.trim());

  const validacao: Record<string, boolean> = {};
  if (dados.nome.trim() === '') {
    validacao['nome'] = true;
  }
  if (dados.email.trim() === '') {
    validacao['email'] = true;
  }
  if (dados.senha.trim() === '') {
    validacao['senha'] = true;
  }
  if (Object.keys(validacao).length !== 0) {
    throw new ValidationError('Elementos faltantes ou incorretos.', validacao);
  }

  return prisma.usuario.create({
    data: {
      nome: dados.nome.trim().toLowerCase(),
      email: dados.email.trim().toLowerCase(),
      senha: senhaCriptografada,
      ehAdmin: dados.ehAdmin ?? false,
    },
  });
}

// retornar usuarios
export async function retornarUsuarios({
  orderBy = 'createdAt',
  orderDirection = 'desc',
  page = 1,
  size = 10,
  searchField = 'nome',
  searchValue = '',
}: {
  orderBy?: string;
  orderDirection?: string;
  page?: number;
  size?: number;
  searchField?: string;
  searchValue?: string;
}) {
  const validacao: Record<string, boolean> = {};

  const camposValidosParaOrderBy = ['createdAt', 'updatedAt', 'nome'];
  if (!camposValidosParaOrderBy.includes(orderBy)) {
    validacao['orderBy'] = true;
  }

  const camposValidosParaOrderDirection = ['asc', 'desc'];
  if (!camposValidosParaOrderDirection.includes(orderDirection)) {
    validacao['orderDirection'] = true;
  }

  const camposValidosParaSearch = ['nome', 'email'];
  if (!camposValidosParaSearch.includes(searchField)) {
    validacao['searchField'] = true;
  }

  if (Object.keys(validacao).length !== 0) {
    throw new ValidationError('Elementos faltantes ou incorretos.', validacao);
  }

  const skip = (page - 1) * size;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { deletedAt: null };

  if (searchValue.trim() !== '') {
    where[searchField] = { contains: searchValue, mode: 'insensitive' };
  }

  const usuarios = await prisma.usuario.findMany({
    where,
    orderBy: { [orderBy]: orderDirection },
    skip,
    take: size,
    select: {
      id: true,
      nome: true,
      email: true,
      ehAdmin: true,
      estaAtivo: true,
    },
  });

  const total = await prisma.usuario.count({ where });

  return {
    data: usuarios,
    meta: {
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    },
  };
}

// deletar usuarios
export async function deletarUsuario(usuarioId: string) {
  if (!validarUuid(usuarioId)) {
    throw new ValidationError('ID inválido.', { id: true });
  }

  const result = await softDeleteUsuarioRaw(usuarioId);
  if (result === 0) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return { id: usuarioId, deletedAt: new Date() };
}

// atualizar senha 
export async function atualizarSenha({
  usuarioId,
  senhaAtual,
  novaSenha,
}: {
  usuarioId: string;
  senhaAtual: string;
  novaSenha: string;
}) {
  if (!validarUuid(usuarioId)) {
    throw new ValidationError('ID inválido.', { id: true });
  }

  const usuario = await prisma.usuario.findFirst({
    where: { id: usuarioId, deletedAt: null },
  });

  if (!usuario) {
    throw new ForbiddenError('Usuário não encontrado');
  }

  const senhaCorreta = await compararHash(
    senhaAtual.trim(),
    usuario.senha
  );

  if (!senhaCorreta) {
    throw new ForbiddenError('Senha atual incorreta');
  }

  const novaSenhaCriptografada = await gerarHash(novaSenha);

  return prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      senha: novaSenhaCriptografada,
      updatedAt: new Date(),
    },
  });
}


export async function atualizarStatus(id: string) {
  if (!validarUuid(id)) {
    throw new ValidationError('ID inválido.', { id: true });
  }

  const result = await alterarStatusRaw(id);

  if (result === 0) {
    throw new NotFoundError("URL não encontrada");
  }

  return { id };
}

export async function verificarAdmin(usuarioId: string): Promise<boolean> {
  if (!validarUuid(usuarioId)) return false;

  const usuario = await prisma.usuario.findFirst({
    where: {
      id: usuarioId,
      deletedAt: null,
      estaAtivo: true,
      ehAdmin: true,
    },
  });

  return !!usuario;
}

export async function atualizarUsuario({
  id,
  nome,
  ehAdmin,
  senha,
}: {
  id: string;
  nome?: string;
  ehAdmin?: boolean;
  senha?: string;
}) {
  if (!validarUuid(id)) {
    throw new ValidationError('ID inválido.', { id: true });
  }

  let senhaCriptografada = undefined;
  if (senha) {
    senhaCriptografada = await gerarHash(senha?.trim());
  }
  const result = await atualizarUsuarioRaw({
    id,
    nome: nome?.trim() === '' ? undefined : nome?.trim().toLowerCase(),
    ehAdmin,
    senha: senhaCriptografada
  });

  if (result === 0) {
    throw new NotFoundError('Usuario nao encontrada');
  }

  return { id, updatedAt: new Date() };
}