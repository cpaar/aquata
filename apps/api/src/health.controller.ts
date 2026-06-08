import { Controller, Get } from "@nestjs/common";

type HealthResponse = {
  service: "aquata-api";
  status: "ok";
};

@Controller()
export class HealthController {
  @Get("health")
  health(): HealthResponse {
    return {
      service: "aquata-api",
      status: "ok",
    };
  }
}
