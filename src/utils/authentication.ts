import * as argon2 from 'argon2';
import { Request } from 'express';

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(passwordHash, password);
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
