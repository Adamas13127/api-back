import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS pour ton front Vercel
  app.enableCors({
    origin: ['https://api-front-k1nhgt6pj-semmaches-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-app-version'],
    exposedHeaders: ['Content-Length', 'X-Knowledge-Base'],
  });

  // 👉 Prefix global pour l'API, MAIS on exclut Swagger
  app.setGlobalPrefix('api/v1', {
    exclude: ['docs', 'docs-json'], // <– routes Swagger sans prefix
  });

  // Validation DTO partout
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 🧾 Swagger config
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

  const document = SwaggerModule.createDocument(app, config);

  // 👉 Swagger servie sur /docs (sans prefix)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
