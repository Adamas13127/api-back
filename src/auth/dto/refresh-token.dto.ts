// DTO utilisé pour la route POST /auth/refresh.
// Il contient uniquement le refreshToken envoyé par le client.
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
