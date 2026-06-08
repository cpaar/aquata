import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { GameService } from "./game.service.js";

@Controller("game")
@UseGuards(AuthGuard)
export class GameController {
  constructor(@Inject(GameService) private readonly game: GameService) {}

  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.game.getSnapshot(user);
  }
}
