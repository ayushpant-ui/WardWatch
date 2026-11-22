import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const errors: Record<string, string[]> = {};
        for (const err of validationErrors) {
          if (err.constraints) {
            errors[err.property] = Object.values(err.constraints);
          }
        }
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`WardWatch NestJS API running on http://localhost:${port}/api`);
}
bootstrap();