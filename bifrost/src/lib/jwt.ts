import { SignJWT, jwtVerify, decodeJwt} from 'jose';
import { payloadJwt } from '@/type/payload';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const EXPIRES_IN = process.env.EXPIRES_IN!;

// Assina o token com HS256
export async function assinarToken(payload: payloadJwt): Promise<string> {
  console.log(EXPIRES_IN)
  console.log(JWT_SECRET)
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
}

// Verifica e valida a assinatura do token
export async function verificarToken(token: string): Promise<payloadJwt> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as payloadJwt;
}

// Decodifica sem verificar assinatura (apenas leitura)
export function decodificarToken(token: string): payloadJwt {
  return decodeJwt(token) as payloadJwt;
}


export async function verificarTokenJose(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const { payload } = await jwtVerify(token, secret);
  return payload;
}