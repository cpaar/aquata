import { sessions, users, type DbClient } from "@aquata/db";
import { ConflictException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { and, eq, gt, or } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { hash, verify } from "argon2";

import { ConfigService } from "../config.service.js";
import { DB_CLIENT } from "../persistence/db.provider.js";
import type { AuthenticatedUser } from "./auth.types.js";

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_CLIENT) private readonly client: DbClient,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  async register(input: {
    username: string;
    email: string;
    password: string;
  }): Promise<AuthenticatedUser> {
    const username = input.username.trim();
    const email = input.email.trim().toLowerCase();
    const passwordHash = await hash(input.password, { type: 2 });

    try {
      const [user] = await this.client.db
        .insert(users)
        .values({ email, passwordHash, username })
        .returning({
          email: users.email,
          id: users.id,
          role: users.role,
          username: users.username,
        });
      if (!user) {
        throw new ConflictException("Could not create user");
      }
      return user;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException("Username or email already exists");
      }
      throw error;
    }
  }

  async login(
    login: string,
    password: string,
  ): Promise<{ sessionId: string; user: AuthenticatedUser }> {
    const normalizedLogin = login.trim().toLowerCase();
    const [user] = await this.client.db
      .select()
      .from(users)
      .where(or(eq(users.email, normalizedLogin), eq(users.username, login.trim())))
      .limit(1);

    if (!user || !(await verify(user.passwordHash, password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const sessionId = randomBytes(32).toString("base64url");
    await this.client.db.insert(sessions).values({
      expiresAt: this.sessionExpiry(),
      id: sessionId,
      userId: user.id,
    });

    return {
      sessionId,
      user: { email: user.email, id: user.id, role: user.role, username: user.username },
    };
  }

  async userForSession(sessionId: string | undefined): Promise<AuthenticatedUser | undefined> {
    if (!sessionId) {
      return undefined;
    }

    const [row] = await this.client.db
      .select({
        email: users.email,
        id: users.id,
        role: users.role,
        username: users.username,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
      .limit(1);

    return row;
  }

  async logout(sessionId: string | undefined): Promise<void> {
    if (sessionId) {
      await this.client.db.delete(sessions).where(eq(sessions.id, sessionId));
    }
  }

  private sessionExpiry(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.config.sessionTtlDays);
    return expiresAt;
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
