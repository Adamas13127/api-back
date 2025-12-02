// DTO utilisé pour créer un utilisateur côté API (register ou admin).
// Il impose un email valide, un mot de passe minimum, et éventuellement un rôle.
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: 'user' | 'admin';
}
