import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  readonly databaseUrl =
    process.env.DATABASE_URL ?? "postgres://aquata:aquata@localhost:55432/aquata";
  readonly nodeEnv = process.env.NODE_ENV ?? "development";
  readonly sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "aquata_session";
  readonly sessionTtlDays = Number(process.env.SESSION_TTL_DAYS ?? 14);
  readonly tickAdminToken = process.env.TICK_ADMIN_TOKEN;

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
}
