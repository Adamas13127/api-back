import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; // user | admin

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refreshToken: string | null;

}
