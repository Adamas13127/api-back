// Service associé au contrôleur racine.
// Ici il ne fait que renvoyer une chaîne, mais dans une vraie app
// on pourrait y mettre de la logique métier partagée.
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
