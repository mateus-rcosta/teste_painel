import { errorHandling } from '@/erro/errorHandling';
import { editarUrl, deletarUrl, getUrlById } from '@/service/urlService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const body = await req.json();
    const url = await editarUrl({ id: params.id, ...body });
    return NextResponse.json(url);
  }
);

export const DELETE = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const url = await deletarUrl((await params).id);
    return NextResponse.json(url);
  }
);

export const GET = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const url = await getUrlById((await params).id);
    return NextResponse.json(url);
  }
);
