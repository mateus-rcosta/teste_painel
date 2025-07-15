import { updateSenha } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { senhaAtual, novaSenha } = body;

    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const usuario = await updateSenha({
      usuarioId: userId,
      senhaAtual,
      novaSenha,
    });

    return NextResponse.json(usuario);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}