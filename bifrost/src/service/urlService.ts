import { prisma } from '@/lib/prisma';
import { validarUuid } from '@/lib/validar';
import { NotFoundError, ValidationError } from '@/erro/errorHandling';
import { UTM } from '@/type/utm';

import {
  updateUrlRaw,
  softDeleteUrlRaw,
  toggleUrlAtivoRaw,
} from '@/repository/urlRepository';


export async function getUrlById(id: string) {
  const url = await prisma.url.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      nome: true,
      utms: true,
      target: true,
      estaAtivo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!url) {
    throw new NotFoundError("URL não encontrada");
  }

  return url;
}

export async function criarUrl({
  nome,
  utms,
  target,
}: {
  nome: string;
  utms: UTM;
  target: string;
}) {
  return prisma.url.create({
    data: { nome, utms: { ...utms }, target },
    select: { id: true },
  });
}

export async function getUrls({
  page = 1,
  size = 10,
  orderBy = 'createdAt',
  orderDirection = 'desc',
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

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        nome: true,
        utms: true,
        target: true,
        estaAtivo: true,
      },
      orderBy: { [orderBy]: orderDirection },
      skip,
      take: size,
    }),
    prisma.url.count({ where: { deletedAt: null } }),
  ]);

  return {
    data: urls,
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
  };
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
  if (!validarUuid(id)) {
    throw new ValidationError('ID inválido');
  }

  const result = await updateUrlRaw({ id, nome, utms, target });

  if (result === 0) {
    throw new NotFoundError('URL não encontrada');
  }

  return { id, updatedAt: new Date() };
}

export async function toggleUrlAtivo(id: string) {
  if (!validarUuid(id)) {
    throw new ValidationError("ID inválido");
  }

  const result = await toggleUrlAtivoRaw(id);

  if (result === 0) {
    throw new NotFoundError("URL não encontrada");
  }

  return { id };
}

export async function deletarUrl(id: string) {
  if (!validarUuid(id)) {
    throw new ValidationError('ID inválido');
  }

  const result = await softDeleteUrlRaw(id);
  if (result === 0) {
    throw new NotFoundError('URL não encontrada');
  }

  return { id, deletedAt: new Date() };
}