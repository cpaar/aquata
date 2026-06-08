import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

const DEFAULT_PORT = 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
  });

  const port = Number(process.env.PORT ?? DEFAULT_PORT);
  await app.listen(port, "0.0.0.0");
}

await bootstrap();
