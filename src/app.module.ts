// Module racine de l'application.
// Il assemble la configuration globale (env, DB, rate limiting)
// et les différents modules fonctionnels (auth, users, products).
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Chargement du fichier .env et mise à disposition des variables dans toute l'app
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting global : chaque IP est limitée à 10 requêtes toutes les 10 secondes
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),

    // Configuration TypeORM pour se connecter à la base Postgres
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432', 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS') || undefined,
        database: config.get<string>('DB_NAME'),
        synchronize: true, // ⚠️ à désactiver en prod, génère le schéma automatiquement
        autoLoadEntities: true, // charge automatiquement toutes les entités présentes dans les modules
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    // Modules fonctionnels de l'application
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    // Application globale du ThrottlerGuard (rate limiting) sur toutes les routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
