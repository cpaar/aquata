import { type DbClient } from "@aquata/db";
import { Controller, Get, Inject } from "@nestjs/common";

import { DB_CLIENT } from "./persistence/db.provider.js";

type HealthResponse = {
  database: "ok";
  service: "aquata-api";
  status: "ok";
};

@Controller()
export class HealthController {
  constructor(@Inject(DB_CLIENT) private readonly client: DbClient) {}

  @Get("health")
  async health(): Promise<HealthResponse> {
    await this.client.pool.query("select 1");
    return {
      database: "ok",
      service: "aquata-api",
      status: "ok",
    };
  }
}
