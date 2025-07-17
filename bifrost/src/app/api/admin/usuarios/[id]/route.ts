import { errorHandling } from '@/erro/errorHandling';
import { ehAdmin } from '@/lib/ehAdmin';
import { atualizarUsuario, deletarUsuario, retornarUsuarioPorId } from '@/service/usuarioService';
import { NextResponse } from 'next/server';

export const DELETE = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!ehAdmin(userId)) {
      return NextResponse.json({}, { status: 403 });
    }
    const resolvedParams = await params;
    const usuario = await deletarUsuario(resolvedParams.id);
    return NextResponse.json(usuario);
  }
);

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = req.headers.get('x-user-id')!;
    if (!ehAdmin(userId)) {
      return NextResponse.json({}, { status: 403 });
    }
    const body = await req.json();
    const resolvedParams = await params;
    const usuario = await atualizarUsuario({ id: resolvedParams.id, ...body });
    return NextResponse.json(usuario);
  }
);

export const GET = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const userId = req.headers.get('x-user-id')!;
   
    if (!ehAdmin(userId)) {
      return NextResponse.json({}, { status: 403 });
    }
   
    const resolvedParams = await params;
    const usuario = await retornarUsuarioPorId(resolvedParams.id);
   
    return NextResponse.json(usuario);
  }
);