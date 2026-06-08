import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";

import { ConfigService } from "../config.service.js";
import { AuthGuard } from "./auth.guard.js";
import { AuthService } from "./auth.service.js";
import { CurrentUser } from "./current-user.decorator.js";
import { LoginDto, RegisterDto } from "./auth.dto.js";
import type { AuthenticatedUser } from "./auth.types.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<{ user: AuthenticatedUser }> {
    return { user: await this.auth.register(dto) };
  }

  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthenticatedUser }> {
    const { sessionId, user } = await this.auth.login(dto.login, dto.password);
    response.cookie(this.config.sessionCookieName, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: this.config.isProduction,
    });
    return { user };
  }

  @Post("logout")
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ ok: true }> {
    const cookies = request.cookies as Record<string, string | undefined> | undefined;
    await this.auth.logout(cookies?.[this.config.sessionCookieName]);
    response.clearCookie(this.config.sessionCookieName);
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthenticatedUser): { user: AuthenticatedUser } {
    return { user };
  }
}
