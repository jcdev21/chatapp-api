import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: 'http://localhost:5173' });
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
