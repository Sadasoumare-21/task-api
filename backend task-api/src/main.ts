import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Activer le CORS de manière dynamique (Local + Production)
  const origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://task-api-one-blush.vercel.app' // Protocole complet pour éviter les rejets CORS
  ];
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 2. Validation globale (Optionnel mais recommandé pour les DTOs)
  app.useGlobalPipes(new ValidationPipe());

  // 3. Configuration de Swagger (Documentation de l'API)
  const config = new DocumentBuilder()
    .setTitle('API Mikey Tasks & Weather')
    .setDescription('Documentation officielle pour l\'examen de Génie Informatique')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entre ton jeton de connexion (access_token) ici',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Gestion dynamique du Port pour Render / Railway
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  // Des logs de console plus propres en production
  console.log(`🚀 Application s'exécute avec succès sur le port : ${port}`);
  console.log(`📄 Si en local, Swagger dispo sur : http://localhost:${port}/api/docs`);
}
bootstrap(); 