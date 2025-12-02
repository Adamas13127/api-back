// DTO de mise à jour de produit.
// Tous les champs de CreateProductDto deviennent optionnels (PATCH partiel).
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
