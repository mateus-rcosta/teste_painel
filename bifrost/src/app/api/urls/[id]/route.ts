import { errorHandling } from '@/erro/errorHandling';
import { atualizarUrl, deletarUrl, retornarUrlPorId } from '@/service/urlService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const body = await req.json();
    const url = await atualizarUrl({ id: (await params).id, ...body });
    return NextResponse.json(url);
  }
);

export const DELETE = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const url = await deletarUrl((await params).id);
    return NextResponse.json(url);
  }
);

export const GET = errorHandling(
  async (req: Request, context : { params: Promise<{ id: string }> }) => {
    const id = (await context.params).id;
    const url = await retornarUrlPorId(id);
    return NextResponse.json(url);
  }
);
