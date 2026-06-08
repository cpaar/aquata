import { Body, Controller, ForbiddenException, Headers, Inject, Post } from "@nestjs/common";

import { ConfigService } from "../config.service.js";
import { RunTickDto } from "./game.dto.js";
import { TickService } from "./tick.service.js";

@Controller("dev")
export class DevController {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(TickService) private readonly ticks: TickService,
  ) {}

  @Post("tick")
  runTick(@Body() dto: RunTickDto, @Headers("x-tick-admin-token") token?: string) {
    if (this.config.isProduction && token !== this.config.tickAdminToken) {
      throw new ForbiddenException("Tick endpoint requires admin token in production");
    }

    return this.ticks.runPersistedTick(dto);
  }
}
