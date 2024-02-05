import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.enableCors({
    origin: '*',
  });

  // use validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // use http exception filter
  // app.useGlobalFilters(new HttpExceptionFilter());

  // set global prefix
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);

  console.log(`Server is running on port ${port}`);

  await app.listen(port);
}

bootstrap();
