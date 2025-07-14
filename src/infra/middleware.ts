import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verificarToken } from '@/lib/jwt';
import { verificaAdmin } from '@/service/usuarioService';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const payload = verificarToken(token) as {
      userId: string;
    };

    const pathname = req.nextUrl.pathname;

    const isAdminRoute = pathname.startsWith('/api/admin');

    if (isAdminRoute) {
      const isAdmin = await verificaAdmin(payload.userId);
      if (!isAdmin) {
        return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
      }
    }

    const res = NextResponse.next();
    res.headers.set('x-user-id', payload.userId);
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};