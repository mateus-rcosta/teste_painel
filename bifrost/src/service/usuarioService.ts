import { prisma } from '@/lib/prisma';
import { gerarHash, compararHash } from '@/lib/bcrypt';
import { validarUuid } from '@/lib/validar';
import { ForbiddenError, NotFoundError, ValidationError } from '@/erro/errorHandling';
import {
  softDeleteUsuarioRaw,
  toggleUsuarioAtivoRaw,
} from '@/repository/usuarioRepository';

export async function getUsuarioPorId(id: string) {
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


export async function createUsuario(dados: {
  nome: string;
  email: string;
  senha: string;
  ehAdmin?: boolean;
}) {
  const senhaCriptografada = await gerarHash(dados.senha);
  return prisma.usuario.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: senhaCriptografada,
      ehAdmin: dados.ehAdmin ?? false,
    },
  });
}

export async function getUsuarios({
  orderBy = 'createdAt',
  orderDirection = 'desc',
  page = 1,
  size = 10,
}: {
  orderBy?: string;
  orderDirection?: string;
  page?: number;
  size?: number;
}) {
  const camposValidosParaOrderBy = ['createdAt', 'updatedAt', 'nome'];
  if (!camposValidosParaOrderBy.includes(orderBy)) {
    throw new ValidationError(`Campo 'orderBy' inválido: ${orderBy}`);
  }

  const camposValidosParaOrderDirection = ['asc', 'desc'];
  if (!camposValidosParaOrderDirection.includes(orderDirection)) {
    throw new ValidationError(`Campo 'orderDirection' inválido: ${orderDirection}`);
  }
  const skip = (page - 1) * size;

  const usuarios = await prisma.usuario.findMany({
    where: { deletedAt: null },
    orderBy: {
      [orderBy]: orderDirection,
    },
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

  const total = await prisma.usuario.count({
    where: { deletedAt: null },
  });

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

export async function deleteUsuario(usuarioId: string) {
  if (!validarUuid(usuarioId)) {
    throw new NotFoundError('ID inválido');
  }

  const result = await softDeleteUsuarioRaw(usuarioId);
  if (result === 0) {
    throw new NotFoundError('Usuário não encontrado');
  }

  return { id: usuarioId, deletedAt: new Date() };
}

export async function updateSenha({
  usuarioId,
  senhaAtual,
  novaSenha,
}: {
  usuarioId: string;
  senhaAtual: string;
  novaSenha: string;
}) {
  if (!validarUuid(usuarioId)) {
    throw new NotFoundError('ID inválido');
  }

  const usuario = await prisma.usuario.findFirst({
    where: { id: usuarioId, deletedAt: null },
  });

  if (!usuario) {
    throw new ForbiddenError('Usuário não encontrado');
  }

  const senhaCorreta = await compararHash(senhaAtual, usuario.senha);
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


export async function alterarStatus(id: string) {
  if (!validarUuid(id)) {
    throw new ValidationError("ID inválido");
  }

  const result = await toggleUsuarioAtivoRaw(id);

  if (result === 0) {
    throw new NotFoundError("URL não encontrada");
  }

  return { id };
}

export async function verificaAdmin(usuarioId: string): Promise<boolean> {
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