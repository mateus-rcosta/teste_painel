import { prisma } from '@/lib/prisma';
import { UTM } from '@/type/utm';

export async function updateUrlRaw({
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
  return prisma.$executeRaw`
    UPDATE urls
    SET
      nome = COALESCE(${nome}, nome),
      utms = COALESCE(${utms}::jsonb, utms),
      target = COALESCE(${target}, target),
      updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}

export async function alterarStatusRaw(id: string) {
  return prisma.$executeRaw`
    UPDATE urls
    SET esta_ativo = NOT esta_ativo,
        updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}

export async function softDeleteUrlRaw(id: string) {
  return prisma.$executeRaw`
    UPDATE urls
    SET deleted_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}