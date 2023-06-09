import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const port = process.env.PORT||5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix('api')
 
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/hbsdirectory/views'));
  app.setViewEngine('hbs');
  await app.listen(port);
  
}
bootstrap();
