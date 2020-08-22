import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppErrors from '@shared/errors/AppErrors';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validação do token jwt
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppErrors('Jwt token is missing', 401);
  }
  // Bearer sjughdfkjgdfh
  const [, token] = authHeader.split(' ');

  try {
    // caso o token naoseja valido
    const decoded = verify(token, authConfig.jwt.secret);
    // dizendo que decoded é to do tipo tokenPayload, pois o decoded nao sabe que tipo de objeto é
    const { sub } = decoded as TokenPayload;
    request.user = {
      id: sub,
    };
    return next();
  } catch {
    throw new AppErrors('Invalid JWT token', 401);
  }
}
