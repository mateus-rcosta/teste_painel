import { criarUrl, getUrls } from '@/service/urlService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = await criarUrl(body);
    return NextResponse.json(url, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const urls = await getUrls();
    return NextResponse.json(urls);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}