import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const EXPIRES_IN = '7d';

export function assinarToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

export function verificarToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

export function decodificarToken(token: string): any {
  return jwt.decode(token);
}