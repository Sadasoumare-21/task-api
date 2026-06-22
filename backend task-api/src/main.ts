import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Activer le CORS (Indispensable pour ton Frontend React)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174' // Ajoute l'URL actuelle de ton Frontend
    ],
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
      'JWT-auth', // Le nom du mécanisme de sécurité qu'on appliquera sur nos routes
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // La documentation sera accessible sur http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Le serveur tourne sur : http://localhost:3000`);
  console.log(`📄 La documentation Swagger est disponible sur : http://localhost:3000/api/docs`);
}
bootstrap();