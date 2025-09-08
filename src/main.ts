import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ResponseInterceptor } from '@interceptors/response.interceptor';
import { readFileSync } from 'fs';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';


async function bootstrap() {
  
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_URL!],
  //     queue: process.env.RABBITMQ_USERMS_QUEUE!,
  //     queueOptions: {
  //       durable: true
  //     },
  //   }
  // });
  const httpsOptions: HttpsOptions = {
    key: readFileSync('./localhost-key.pem'),
    cert: readFileSync('./localhost.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors({
    origin: ['https://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('The cats API description')
    .setDescription('API para gerenciar usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });


  // app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
