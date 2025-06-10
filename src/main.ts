import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }),
  );

  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.json({
      message: 'User Management APIs are running',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  await app.listen(process.env.PORT || 3005);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT || 3005}`,
  );
}

bootstrap();
