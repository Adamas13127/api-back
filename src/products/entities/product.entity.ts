// Entité Product représentant un produit dans la boutique.
// Elle est mappée sur une table SQL via TypeORM.
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Nom lisible du produit
  @Column({ length: 255 })
  name: string;

  // Prix stocké en décimal (précision 10, 2 décimales)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  // Date de création automatiquement remplie par la BDD
  @CreateDateColumn()
  createdAt: Date;
}
