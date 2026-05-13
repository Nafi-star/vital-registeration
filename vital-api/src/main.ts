import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const devJwtPlaceholder = 'dev-only-change-JWT_SECRET-in-production';
  if (process.env.NODE_ENV === 'production') {
    const secret = process.env.JWT_SECRET ?? '';
    if (!secret || secret === devJwtPlaceholder) {
      throw new Error(
        'Refusing to start: set JWT_SECRET to a strong random value in production (see vital-api/.env.example).',
      );
    }
    const pass = process.env.ADMIN_PASSWORD ?? '';
    if (!pass || pass === 'admin' || pass === 'change-me') {
      throw new Error(
        'Refusing to start: change ADMIN_PASSWORD from the default in production.',
      );
    }
  }

  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const originRaw = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const origins = originRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length <= 1 ? origins[0] ?? true : origins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
