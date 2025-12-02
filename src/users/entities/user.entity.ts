// Entité User mappée sur la table "user" en base de données.
// Elle stocke les infos de connexion et le rôle de l'utilisateur.
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Mot de passe hashé (jamais stocké en clair)
  @Column()
  password: string;

  // Rôle fonctionnel : "user" par défaut, peut être "admin"
  @Column({ default: 'user' })
  role: string; // user | admin

  // Dernier refresh token émis pour cet utilisateur (pour pouvoir l'invalider)
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refreshToken: string | null;
}
