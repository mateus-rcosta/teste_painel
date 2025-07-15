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

export async function toggleUsuarioAtivoRaw(id: string) {
  return prisma.$executeRaw`
    UPDATE usuarios
    SET esta_ativo = NOT esta_ativo,
        updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}
