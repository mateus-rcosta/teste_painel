import { errorHandling } from '@/erro/errorHandling';
import { ehAdmin } from '@/lib/verificaAdmin';
import { deleteUsuario, getUsuarioPorId } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!ehAdmin(userId)) {
      return NextResponse.json({}, { status: 403 });
    }
    const usuario = await deleteUsuario((await params).id);
    return NextResponse.json(usuario);
  }
);

export const GET = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!ehAdmin(userId)) {
      return NextResponse.json({}, { status: 403 });
    }
    const usuario = await getUsuarioPorId((await params).id);
    return NextResponse.json(usuario);
  }
);