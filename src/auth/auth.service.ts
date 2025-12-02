import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      email: dto.email,
      password: dto.password,
      role: 'user',
    });

    // 🔥 on renvoie maintenant tokens + user
    return this.generateAndStoreTokens(user.id, user.email, user.role);
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // 🔥 idem : tokens + user
    return this.generateAndStoreTokens(user.id, user.email, user.role);
  }

  // REFRESH TOKEN
  async refreshTokens(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      const userId = payload.sub;

      const user = await this.usersService.findOne(userId);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Refresh token invalid');
      }

      // On vérifie que le token envoyé est bien celui enregistré
      if (user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token mismatch');
      }

      // Tout est OK → on génère un nouveau couple de tokens
      // 🔥 là aussi on renvoie également user (ce n'est pas gênant)
      return this.generateAndStoreTokens(user.id, user.email, user.role);
    } catch (e) {
      throw new UnauthorizedException('Refresh token invalid or expired');
    }
  }

  // Génère access + refresh, stocke le refresh en DB, et renvoie aussi l'user
  private async generateAndStoreTokens(
    userId: number,
    email: string,
    role: string,
  ) {
    const accessToken = await this.generateAccessToken(userId, email, role);
    const refreshToken = await this.generateRefreshToken(userId, email, role);

    // on enregistre le refresh token pour ce user
    await this.usersService.updateRefreshToken(userId, refreshToken);

    // 🔥 NOUVEAU : on renvoie aussi les infos user
    return {
      accessToken,
      refreshToken,
      user: {
        userId,
        email,
        role,
      },
    };
  }

  private async generateAccessToken(
    userId: number,
    email: string,
    role: string,
  ) {
    const payload = { sub: userId, email, role };
    return this.jwtService.signAsync(payload, {
      // ⚠️ même secret que JwtModule.register et JwtStrategy
      secret: process.env.JWT_SECRET || 'secret123',
      expiresIn: '1h',
    });
  }

  private async generateRefreshToken(
    userId: number,
    email: string,
    role: string,
  ) {
    const payload = { sub: userId, email, role };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: '7d',
    });
  }
}
