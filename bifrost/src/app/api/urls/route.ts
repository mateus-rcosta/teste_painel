import { errorHandling } from '@/erro/errorHandling';
import { criarUrl, getUrls } from '@/service/urlService';
import { NextResponse } from 'next/server';

export const POST = errorHandling(
  async (req: Request) => {
    const body = await req.json();
    const url = await criarUrl(body);
    return NextResponse.json(url, { status: 201 });
  }
);

export const GET = errorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const orderDirection = searchParams.get('orderDirection') || 'desc';

  const result = await getUrls( await { page, size, orderBy, orderDirection });
  return NextResponse.json(result);
});