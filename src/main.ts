import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function main() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.CLIENT_URL });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () =>
    Logger.log('Server successfully started on port ' + port),
  );
}

main();
