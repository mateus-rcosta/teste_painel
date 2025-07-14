import { NextResponse } from 'next/server';
import { createUsuario, getUsuarios } from '@/service/usuarioService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const usuario = await createUsuario(body);
    return NextResponse.json(usuario, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const usuarios = await getUsuarios();
    return NextResponse.json(usuarios);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}