import { prisma } from '@/lib/prisma';
import { UTM } from '@/type/utm';



export async function criarUrl({
  nome,
  utms,
  target,
}: {
  nome: string;
  utms: UTM;
  target: string;
}) {
  const url = await prisma.url.create({
    data: {
      nome,
      utms,
      target,
    },
    select: {
      id: true,
    },
  });

  return url;
}

export async function getUrls() {
  return prisma.url.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      nome: true,
      utms: true,
      target: true,
      estaAtivo: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function editarUrl({
  id,
  nome,
  utms,
  target,
}: {
  id: string;
  nome?: string;
  utms?: UTM;
  target?: string;
}) {
  const atual = await prisma.url.findFirst({
    where: { id, deletedAt: null },
  });

  if (!atual) {
    throw new Error('URL não encontrada');
  }

  return prisma.url.update({
    where: { id },
    data: {
      nome: nome ?? atual.nome,
      utms: utms ?? atual.utms,
      target: target ?? atual.target,
      updatedAt: new Date(),
    },
  });
}

export async function desativarUrl(id: string) {
  return prisma.url.update({
    where: { id },
    data: {
      estaAtivo: false,
      updatedAt: new Date(),
    },
  });
}

export async function deletarUrl(id: string) {
  return prisma.url.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}