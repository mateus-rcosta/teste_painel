import { errorHandling } from '@/erro/errorHandling';
import { toggleUrlAtivo } from '@/service/urlService';
import { NextResponse } from 'next/server';

export const PATCH = errorHandling(
  async (req: Request, { params }: { params: { id: string } }) => {
    const url = await toggleUrlAtivo((await params).id);
    return NextResponse.json(url);
  }
);


