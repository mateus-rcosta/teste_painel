import { alterarStatusAtivo } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { ativo } = body;

    const usuario = await alterarStatusAtivo(params.id, ativo);
    return NextResponse.json(usuario);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}