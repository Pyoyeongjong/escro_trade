import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  })

  const frontend = configService.get<string>('frontend.url') ? configService.get<string>('frontend.url') : 'http://localhost:3000';
  app.enableCors({
    origin: `${frontend}`, // 프론트 주소
    credentials: true,               // 쿠키 사용할 경우 true
  });

  const config = new DocumentBuilder()
    .setTitle("Escro Trade API")
    .setDescription("This is for escro trade project backend API")
    .setVersion("0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)

  app.useGlobalInterceptors(new LoggingInterceptor());

  const port = configService.get<number>('http.port');
  await app.listen(port ?? 3001);
}
bootstrap();
