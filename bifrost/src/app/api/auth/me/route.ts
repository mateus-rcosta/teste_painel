import { errorHandling } from "@/erro/errorHandling";
import { retornarUsuarioPorId } from "@/service/usuarioService";
import { NextResponse } from "next/server";

export const GET = errorHandling(async (req: Request) => {
const userId = req.headers.get('x-user-id')!;

  const usuario = await retornarUsuarioPorId(userId);
  
  if (!usuario) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  return NextResponse.json({ usuario });
});