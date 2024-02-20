import * as argon2 from 'argon2';

export async function verifyPassword(
  passwordHash: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(passwordHash, password);
}
