// Module "Products" responsable de la gestion des produits.
// Il expose un contrôleur REST et un service pour manipuler l'entité Product.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  // On enregistre le repository lié à l'entité Product
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  // RolesGuard est fourni ici pour pouvoir être utilisé avec @UseGuards dans le contrôleur
  providers: [ProductsService, RolesGuard],
})
export class ProductsModule {}
