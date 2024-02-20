import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ZodFilter } from './utils/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.useGlobalFilters(new ZodFilter());
  await app.listen(3000);
}
bootstrap();
