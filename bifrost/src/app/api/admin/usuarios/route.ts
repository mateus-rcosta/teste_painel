import { NextResponse } from 'next/server';
import { createUsuario, getUsuarios } from '@/service/usuarioService';
import { errorHandling } from '@/erro/errorHandling';
import { ehAdmin } from '@/lib/verificaAdmin';

export const POST = errorHandling(async (req: Request) => {
  const userId = req.headers.get('x-user-id')!;

  if (!(await ehAdmin(userId))) {
    return NextResponse.json(
      { error: 'Acesso negado' },
      { status: 403 }
    );
  }
  const body = await req.json();
  const usuario = await createUsuario(body);
  return NextResponse.json(usuario, { status: 201 });
});

export const GET = errorHandling(async (req: Request) => {
 

  const userId = req.headers.get('x-user-id')!;


  if (!(await ehAdmin(userId))) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const orderDirection = searchParams.get('orderDirection') || 'desc';

  const result = await getUsuarios(await { page, size, orderBy, orderDirection });
  return NextResponse.json(result);
});