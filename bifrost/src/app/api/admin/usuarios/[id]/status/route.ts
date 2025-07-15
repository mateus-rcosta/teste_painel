import { errorHandling } from '@/erro/errorHandling';
import { ehAdmin } from '@/lib/verificaAdmin';
import { alterarStatus } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!(await ehAdmin(userId))) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const usuario = await alterarStatus((await params).id);
    return NextResponse.json(usuario);
  }
);