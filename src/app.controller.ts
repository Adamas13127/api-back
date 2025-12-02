// Contrôleur "racine" très simple utilisé surtout comme exemple / healthcheck.
// Il expose une route GET / qui renvoie un message de test.
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Injection du service d'application
  constructor(private readonly appService: AppService) {}

  // GET /
  // Peut servir de route de test pour vérifier que l'API répond bien.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
