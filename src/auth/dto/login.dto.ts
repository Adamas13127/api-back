// DTO utilisé pour la route POST /auth/login.
// Valide la forme des données envoyées par le client.
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
