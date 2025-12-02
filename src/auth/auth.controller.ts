// Contrôleur d'authentification.
// Contient toutes les routes liées au login, à l'inscription,
// au rafraîchissement de token et à la récupération du profil utilisateur.
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth') // regroupe les routes dans l’onglet "Auth" de Swagger
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  // Crée un nouvel utilisateur et renvoie directement un couple de tokens + user.
  @Post('register')
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @ApiCreatedResponse({
    description: 'Utilisateur créé + token JWT retourné',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        summary: 'Exemple de registre',
        value: {
          email: 'user@example.com',
          password: '123456',
        },
      },
    },
  })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  // Vérifie les identifiants, puis renvoie accessToken + refreshToken + infos user.
  @Post('login')
  @ApiOperation({ summary: 'Se connecter et obtenir un token JWT' })
  @ApiOkResponse({
    description: 'Connexion réussie, token JWT retourné',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Identifiants invalides',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        summary: 'Exemple de login',
        value: {
          email: 'user@example.com',
          password: '123456',
        },
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // GET /auth/profile
  // Route protégée par JwtAuthGuard : nécessite un token Bearer valide.
  // Renvoie le payload de l'utilisateur courant (userId, email, role).
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Récupérer le profil de l’utilisateur' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'Profil de l’utilisateur courant',
    schema: {
      example: {
        userId: 1,
        email: 'user@example.com',
        role: 'user',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token manquant ou invalide',
  })
  profile(@Req() req: any) {
    // Le JwtStrategy a injecté les infos user dans req.user
    return req.user;
  }

  // POST /auth/refresh
  // Permet de renouveler le couple access/refresh à partir d'un refreshToken valide.
  @Post('refresh')
  @ApiOperation({
    summary: 'Renouveler le token d’accès à partir du refresh token',
  })
  @ApiOkResponse({
    description: 'Nouveau couple accessToken + refreshToken',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Refresh token invalide' })
  @ApiBody({
    type: RefreshTokenDto,
    examples: {
      default: {
        summary: 'Exemple de refresh',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto);
  }
}