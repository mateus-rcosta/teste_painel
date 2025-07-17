import { prisma } from '@/lib/prisma';

export async function softDeleteUsuarioRaw(usuarioId: string) {
  return prisma.$executeRaw`
    UPDATE usuarios
    SET deleted_at = now()
    WHERE id = ${usuarioId} AND deleted_at IS NULL
  `;
}

export async function updateUsuarioSenhaRaw(usuarioId: string, senhaCriptografada: string) {
  return prisma.$executeRaw`
    UPDATE usuarios
    SET senha = ${senhaCriptografada}, updated_at = now()
    WHERE id = ${usuarioId} AND deleted_at IS NULL
  `;
}

export async function alterarStatusRaw(id: string) {
  return prisma.$executeRaw`
    UPDATE usuarios
    SET esta_ativo = NOT esta_ativo,
        updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}

export async function atualizarUsuarioRaw({
  id,
  nome,
  ehAdmin,
  senha,
}: {
  id: string;
  nome?: string;
  ehAdmin?:boolean;
  senha?: string;
}) {
  return prisma.$executeRaw`
    UPDATE usuarios
    SET
      nome = COALESCE(${nome}, nome),
      eh_admin = COALESCE(${ehAdmin}, eh_admin),
      senha = COALESCE(${senha}, senha),
      updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}
