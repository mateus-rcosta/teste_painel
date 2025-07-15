import { NextRequest, NextResponse } from "next/server";
import { verificarTokenJose } from "./lib/jwt";


export async function middleware(req: NextRequest) {
  
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
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
    
    return res;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
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