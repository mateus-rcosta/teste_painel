import { desativarUrl } from '@/service/urlService';
import { NextResponse } from 'next/server';

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const url = await desativarUrl(params.id);
    return NextResponse.json(url);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}