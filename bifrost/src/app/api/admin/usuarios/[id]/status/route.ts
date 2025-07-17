import { errorHandling } from '@/erro/errorHandling';
import { ehAdmin } from '@/lib/ehAdmin';
import { atualizarStatus } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!(await ehAdmin(userId))) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }
    const resolvedParams = await params;
    const usuario = await atualizarStatus(resolvedParams.id);
    return NextResponse.json(usuario);
  }
);