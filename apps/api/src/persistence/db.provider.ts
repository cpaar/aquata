import { createDbClient, type DbClient } from "@aquata/db";
import { Inject, Injectable, type OnApplicationShutdown } from "@nestjs/common";

import { ConfigService } from "../config.service.js";

export const DB_CLIENT = Symbol("DB_CLIENT");

export const dbProvider = {
  inject: [ConfigService],
  provide: DB_CLIENT,
  useFactory: (config: ConfigService): DbClient => createDbClient(config.databaseUrl),
};

@Injectable()
export class DbShutdown implements OnApplicationShutdown {
  constructor(@Inject(DB_CLIENT) private readonly client: DbClient) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.pool.end();
  }
}
