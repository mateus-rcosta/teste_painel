import jwt from 'jsonwebtoken';
import { jwtVerify } from "jose";
import { payloadJwt } from '@/type/payload';

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = Number(process.env.EXPIRES_IN) * 60 * 60 * 24;

export function assinarToken(payload: payloadJwt): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verificarToken(token: string): unknown {
  return jwt.verify(token, JWT_SECRET);
}

export function decodificarToken(token: string): unknown {
  return jwt.decode(token);
}

export async function verificarTokenJose(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  const { payload } = await jwtVerify(token, secret);
  return payload;
}