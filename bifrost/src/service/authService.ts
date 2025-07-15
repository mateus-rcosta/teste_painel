import { prisma } from '@/lib/prisma';
import { compararHash } from '@/lib/bcrypt';
import { assinarToken } from '@/lib/jwt';
import { ForbiddenError } from '@/erro/errorHandling';

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findFirst({
    where: {
      email,
      deletedAt: null,
      estaAtivo: true,
    },
  });

  if (!usuario) {
    throw new ForbiddenError('Usuário não encontrado ou inativo.');
  }

  const senhaCorreta = await compararHash(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new ForbiddenError('Senha incorreta.');
  }

  const token = assinarToken({
    userId: usuario.id,
    ehAdmin: usuario.ehAdmin,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      ehAdmin: usuario.ehAdmin
    }
  };
};