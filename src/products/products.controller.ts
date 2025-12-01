import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🔒 Création d'un produit : ADMIN uniquement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Créer un produit (ADMIN)' })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({
    description: 'Produit créé avec succès',
    schema: {
      example: {
        id: 3,
        name: 'Clavier gamer',
        price: 49.99,
        createdAt: '2025-11-13T10:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token manquant ou invalide' })
  @ApiForbiddenResponse({ description: "L'utilisateur n'a pas le rôle admin" })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      default: {
        summary: 'Exemple de création',
        value: {
          name: 'Clavier gamer',
          price: 49.99,
        },
      },
    },
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // 🌍 Lecture : accessible à tout le monde (public)
  @Get()
  @ApiOperation({ summary: 'Lister tous les produits (PUBLIC)' })
  @ApiOkResponse({
    description: 'Liste des produits',
    schema: {
      example: [
        {
          id: 1,
          name: 'Souris gamer',
          price: 29.99,
          createdAt: '2025-11-13T09:00:00.000Z',
        },
        {
          id: 2,
          name: 'Casque audio',
          price: 79.99,
          createdAt: '2025-11-13T09:30:00.000Z',
        },
      ],
    },
  })
  async findAll() {
    return this.productsService.findAll();
  }

  // 🌍 Lecture d'un produit : public aussi
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit par son id (PUBLIC)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Produit trouvé',
    schema: {
      example: {
        id: 1,
        name: 'Souris gamer',
        price: 29.99,
        createdAt: '2025-11-13T09:00:00.000Z',
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // 🔒 Update : ADMIN uniquement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un produit (ADMIN)' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Produit mis à jour',
    schema: {
      example: {
        id: 1,
        name: 'Souris gamer RGB',
        price: 34.99,
        createdAt: '2025-11-13T09:00:00.000Z',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token manquant ou invalide' })
  @ApiForbiddenResponse({ description: "L'utilisateur n'a pas le rôle admin" })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      default: {
        summary: 'Exemple de mise à jour',
        value: {
          name: 'Souris gamer RGB',
          price: 34.99,
        },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // 🔒 Delete : ADMIN uniquement
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un produit (ADMIN)' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiNoContentResponse({ description: 'Produit supprimé' })
  @ApiUnauthorizedResponse({ description: 'Token manquant ou invalide' })
  @ApiForbiddenResponse({ description: "L'utilisateur n'a pas le rôle admin" })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
  }
}
