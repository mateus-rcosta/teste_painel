import { NextResponse } from 'next/server';

export class ValidationError extends Error {
  campos: Record<string, boolean>;

  constructor(message: string, campos: Record<string, boolean>) {
    super(message);
    this.name = 'ValidationError';
    this.campos = campos;
  }
}

export class UnauthorizedError extends Error { }
export class ForbiddenError extends Error { }
export class NotFoundError extends Error { }

export function errorHandling<Context = unknown>(
  handler: (req: Request, context: Context) => Promise<NextResponse>
) {
  return async (req: Request, context: Context): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (err) {
      console.error(err);
      if (err instanceof ValidationError) {
        return NextResponse.json(
          { message: err.message, campos: err.campos },
          { status: 400 }
        );
      }
      if (err instanceof UnauthorizedError) {
        return NextResponse.json({ error: err.message }, { status: 401 });
      }
      if (err instanceof ForbiddenError) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      if (err instanceof NotFoundError) {
        return NextResponse.json({ error: err.message }, { status: 404 });
      }
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
  };
}
