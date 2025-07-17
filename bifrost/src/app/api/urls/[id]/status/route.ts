import { errorHandling } from '@/erro/errorHandling';
import { atualizarStatus } from '@/service/urlService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const url = await atualizarStatus((await params).id);
    return NextResponse.json(url);
  }
);


