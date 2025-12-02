// DTO utilisé pour la création d'un produit.
// On valide que le nom est une chaîne non vide et que le prix est un nombre positif.
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;
}
