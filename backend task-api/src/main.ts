import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Activer le CORS de manière dynamique (Local + Production)
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://task-api-one-blush.vercel.app', // Frontend Vercel production
  ];

  // Ajouter dynamiquement l'URL frontend depuis les variables d'environnement
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Accepter les requêtes sans origin (Postman, mobile) + les origins autorisées
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Requête bloquée depuis : ${origin}`);
        callback(new Error('Non autorisé par CORS'), false);
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 2. Validation globale des DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // 3. Configuration de Swagger (Documentation de l'API)
  const config = new DocumentBuilder()
    .setTitle('API Mikey Tasks & Weather')
    .setDescription("Documentation officielle pour l'examen de Génie Informatique")
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
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 est OBLIGATOIRE pour Render !

  console.log(`🚀 Application démarrée avec succès sur le port : ${port}`);
  console.log(`📄 Swagger disponible sur : http://localhost:${port}/api/docs`);
  console.log(`🌐 Environnement : ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();