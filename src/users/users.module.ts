// Module "Users" responsable de la gestion des utilisateurs en base.
// Il expose surtout UsersService et l'entité User pour les autres modules (Auth, etc.).
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  // TypeOrmModule.forFeature rend disponible le repository lié à l'entité User
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  // On exporte le service pour qu'il puisse être injecté dans AuthModule par exemple
  exports: [UsersService], // AuthService va utiliser UsersService
})
export class UsersModule {}
