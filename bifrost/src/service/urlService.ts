/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma';
import { validarUuid } from '@/lib/validar';
import { NotFoundError, ValidationError } from '@/erro/errorHandling';
import { limparUtm, UTM } from '@/type/utm';

import {
  updateUrlRaw,
  softDeleteUrlRaw,
  alterarStatusRaw,
} from '@/repository/urlRepository';
import { InputJsonValue } from '@prisma/client/runtime/client';


export async function retornarUrlPorId(id: string) {
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
  const validacao: Record<string, boolean> = {};
  if (nome.trim() === '') {
    validacao['nome'] = true;
  }
  if (target.trim() === '') {
    validacao['target'] = true;
  }

  if (Object.keys(validacao).length !== 0) {
    throw new ValidationError('Elementos faltantes ou incorretos.', validacao);
  }

  const utmsLimpos = await limparUtm(utms);
  
  return prisma.url.create({
    data: { nome: nome.trim(), utms: utmsLimpos as InputJsonValue, target: target.trim() },
    select: { id: true },
  });
}

export async function retornarUrls({
  page = 1,
  size = 10,
  orderBy = 'createdAt',
  orderDirection = 'desc',
  searchField = 'nome',
  searchValue = '',
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

  const camposValidosParaSearch = ['nome', 'target', 'utms.source', 'utms.medium', 'utms.campaign', 'utms.term', 'utms.content'];
  if (!camposValidosParaSearch.includes(searchField)) {
    validacao['searchField'] = true;
  }

  if (Object.keys(validacao).length !== 0) {
    throw new ValidationError('Elementos faltantes ou incorretos.', validacao);
  }

  const skip = (page - 1) * size;

  const whereClause: Record<string, any> = { deletedAt: null };

  if (searchValue) {
    if (searchField.startsWith('utms.')) {
      const utmField = searchField.split('.')[1];
      whereClause[`utms` as any] = {
        path: [utmField],
        equals: undefined,
        contains: searchValue,
        mode: 'insensitive'
      };
    } else {
      whereClause[searchField] = { contains: searchValue, mode: 'insensitive' };
    }
  }

  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where: whereClause,
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
    prisma.url.count({ where: whereClause }),
  ]);

  return {
    data: urls,
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
  };
}

export async function atualizarUrl({
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
    throw new ValidationError('ID inválido.', { id: true });
  }

  const validacao: Record<string, boolean> = {};
  if (nome?.trim() === '') {
    validacao['nome'] = true;
  }
  if (target?.trim() === '') {
    validacao['target'] = true;
  }

  if (Object.keys(validacao).length !== 0) {
    throw new ValidationError('Elementos faltantes ou incorretos.', validacao);
  }

  const result = await updateUrlRaw({ id, nome: nome?.trim(), utms: utms?limparUtm(utms):undefined, target: target?.trim() });

  if (result === 0) {
    throw new NotFoundError('URL não encontrada');
  }

  return { id, updatedAt: new Date() };
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

export async function deletarUrl(id: string) {
  if (!validarUuid(id)) {
    throw new ValidationError('ID inválido.', { id: true });
  }

  const result = await softDeleteUrlRaw(id);
  if (result === 0) {
    throw new NotFoundError('URL não encontrada');
  }
  return { id, deletedAt: new Date() };
}