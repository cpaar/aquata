import { Module } from "@nestjs/common";

import { AuthController } from "./auth/auth.controller.js";
import { AuthGuard } from "./auth/auth.guard.js";
import { AuthService } from "./auth/auth.service.js";
import { ConfigService } from "./config.service.js";
import { CommandsController } from "./game/commands.controller.js";
import { DevController } from "./game/dev.controller.js";
import { GameController } from "./game/game.controller.js";
import { GameService } from "./game/game.service.js";
import { TickService } from "./game/tick.service.js";
import { DbShutdown, dbProvider } from "./persistence/db.provider.js";
import { HealthController } from "./health.controller.js";

@Module({
  controllers: [
    AuthController,
    CommandsController,
    DevController,
    GameController,
    HealthController,
  ],
  providers: [
    AuthGuard,
    AuthService,
    ConfigService,
    dbProvider,
    DbShutdown,
    GameService,
    TickService,
  ],
})
export class AppModule {}
