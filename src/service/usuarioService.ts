import { prisma } from '@/lib/prisma';
import { gerarHash, compararHash } from '@/lib/bcrypt';

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

export async function getUsuarios() {
  return prisma.usuario.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      nome: true,
      email: true,
      ehAdmin: true,
      estaAtivo: true,
      createdAt: true,
    },
  });
}

export async function deleteUsuario(usuarioId: string) {
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { deletedAt: new Date() },
  });
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
  const usuario = await prisma.usuario.findFirst({
    where: { id: usuarioId, deletedAt: null },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaCorreta = await compararHash(senhaAtual, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha atual incorreta');
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

export async function alterarStatusAtivo(usuarioId: string, novoStatus: boolean) {
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      estaAtivo: novoStatus,
      updatedAt: new Date(),
    },
  });
}

export async function verificaAdmin(usuarioId: string): Promise<boolean> {
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