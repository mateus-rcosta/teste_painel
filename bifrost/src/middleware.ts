import { NextRequest, NextResponse } from 'next/server';
import { verificarTokenJose } from './lib/jwt';


export async function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  const allowOrigin = process.env.NEXT_PUBLIC_DOMINIO!;
  console.log(allowOrigin);
  const isAllowed = !origin || origin === allowOrigin;

  // Se for preflight (CORS OPTIONS), responder direto com headers
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': isAllowed ? origin! : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Valida o token
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Não autenticado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin! : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const jwtPayload = await verificarTokenJose(token);

    const userId = jwtPayload.userId as string;
    const ehAdmin = typeof jwtPayload.ehAdmin === 'boolean' ? jwtPayload.ehAdmin : false;

    if (!userId) {
      throw new Error('UserId não encontrado no payload do token.');
    }

    const res = NextResponse.next();

    res.headers.set('x-user-id', userId);
    res.headers.set('x-eh-admin', ehAdmin.toString());

    // Adiciona headers CORS à resposta final
    res.headers.set('Access-Control-Allow-Origin', allowOrigin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return res;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: 'Token inválido' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin! : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export const config = {
  matcher: [
    '/api/admin',
    '/api/admin/:path*',
    '/api/usuarios',
    '/api/usuarios/:path*',
    '/api/urls',
    '/api/auth/me',
    '/api/urls/:path*',
  ],
};
