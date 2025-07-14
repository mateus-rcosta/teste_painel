import { editarUrl, deletarUrl } from '@/service/urlService';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const url = await editarUrl({ id: params.id, ...body });
    return NextResponse.json(url);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = await deletarUrl(params.id);
    return NextResponse.json(url);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}