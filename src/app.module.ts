import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Throttle } from '@nestjs/throttler';


@Module({
  imports: [
    // .env global
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting  max 10 / 10 secondes 
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),

    // TypeORM 
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '3306', 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS') || undefined,
        database: config.get<string>('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    // ThrottlerGuard all routes
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
