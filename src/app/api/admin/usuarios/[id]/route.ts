import { deleteUsuario } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const usuario = await deleteUsuario(params.id);
    return NextResponse.json(usuario);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}