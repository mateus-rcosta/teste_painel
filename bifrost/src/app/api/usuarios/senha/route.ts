import { atualizarSenha } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { senhaAtual, novaSenha } = body;

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const usuario = await atualizarSenha({
      usuarioId: userId,
      senhaAtual,
      novaSenha,
    });

    return NextResponse.json(usuario);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}