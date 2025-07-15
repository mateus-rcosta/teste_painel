import { errorHandling } from '@/erro/errorHandling';
import { login } from '@/service/authService';
import { NextResponse } from 'next/server';

export const POST = errorHandling(
  async (req: Request) => {
    const { email, senha } = await req.json();

    const { token, usuario } = await login(email, senha);

    const res = NextResponse.json({ usuario });

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1, // 1 dia
    });

    return res;
  }
);