// DTO utilisé pour la route POST /auth/register.
// On impose un email valide et un mot de passe minimum de 6 caractères.
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
