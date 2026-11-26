import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Db } from './db/index.ts';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
export const SESSION_COOKIE = 'aq_session';
const SESSION_DAYS = 30;

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [, salt, key] = stored.split('$');
  if (!salt || !key) return false;
  const expected = Buffer.from(key, 'base64');
  const actual = await scrypt(pw, Buffer.from(salt, 'base64'), expected.length);
  return timingSafeEqual(expected, actual);
}

export async function createSession(db: Db, accountId: number): Promise<{ token: string; expires: Date }> {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.query('insert into sessions (token, account_id, expires_at) values ($1, $2, $3)', [token, accountId, expires.toISOString()]);
  return { token, expires };
}

export interface Account { id: number; email: string; name: string }

export async function accountFromRequest(db: Db, req: FastifyRequest): Promise<Account | null> {
  const token = req.cookies[SESSION_COOKIE];
  if (!token) return null;
  const { rows } = await db.query<Account>(
    `select a.id, a.email, a.name from sessions s join accounts a on a.id = s.account_id where s.token = $1 and s.expires_at > now()`,
    [token],
  );
  return rows[0] ?? null;
}

/** Für Routen, die ein Konto brauchen: antwortet sonst mit 401 */
export async function requireAccount(db: Db, req: FastifyRequest, reply: FastifyReply): Promise<Account | null> {
  const acc = await accountFromRequest(db, req);
  if (!acc) void reply.code(401).send({ error: 'Bitte anmelden.' });
  return acc;
}
