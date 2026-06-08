import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { SendFleetDto, StartBuildDto, StartResearchDto } from "./game.dto.js";
import { GameService } from "./game.service.js";

@Controller()
@UseGuards(AuthGuard)
export class CommandsController {
  constructor(@Inject(GameService) private readonly game: GameService) {}

  @Post("build-orders")
  startBuild(@CurrentUser() user: AuthenticatedUser, @Body() dto: StartBuildDto) {
    return this.game.startBuild(user, dto.buildableId, dto.quantity);
  }

  @Post("research")
  startResearch(@CurrentUser() user: AuthenticatedUser, @Body() dto: StartResearchDto) {
    return this.game.startResearch(user, dto.researchId);
  }

  @Post("fleets")
  sendFleet(@CurrentUser() user: AuthenticatedUser, @Body() dto: SendFleetDto) {
    return this.game.sendFleet(user, dto.targetStationId, dto.ships);
  }
}
