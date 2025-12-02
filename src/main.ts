// Point d'entrée principal de l'application NestJS.
// On y configure CORS, la validation globale, Swagger, puis on démarre le serveur HTTP.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Création de l'application Nest à partir du module racine AppModule
  const app = await NestFactory.create(AppModule);

  // Configuration CORS pour autoriser le front (hébergé sur Vercel) à appeler l'API
  app.enableCors({
    origin: ['https://api-front-k1nhgt6pj-semmaches-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-app-version'],
    exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
  });

  // Préfixe global ajouté devant toutes les routes (ex: /auth -> /api/v1/auth)
  app.setGlobalPrefix('api/v1');

  // Mise en place de la validation automatique des DTO sur toutes les routes
  // - whitelist: enlève les propriétés non attendues
  // - forbidNonWhitelisted: lève une erreur si le client envoie des champs en trop
  // - transform: convertit automatiquement les types (string -> number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ⚙️ Configuration de la documentation Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setDescription('API de gestion de produits avec authentification JWT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Entrez le token JWT (format: Bearer xxx)',
        in: 'header',
      },
      'access-token',
    )
    .build();

  // Génération du document OpenAPI à partir des décorateurs présents dans le code
  const document = SwaggerModule.createDocument(app, config);

  // Mise à disposition de l'interface Swagger (UI) à l'adresse /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    // 👉 on force l’utilisation des fichiers depuis un CDN pour Swagger UI
    customCssUrl:
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });

  // Démarrage du serveur HTTP sur le port fourni en variable d'environnement (ou 3000 par défaut)
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
