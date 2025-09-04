import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); 
  
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('The cats API description')
    .setDescription('API para gerenciar usuários')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json', 
  }
  );


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
