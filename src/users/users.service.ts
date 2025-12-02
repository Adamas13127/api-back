// Service responsable de toutes les opérations CRUD sur les utilisateurs.
// Il est utilisé notamment par AuthService pour la phase de login/register.
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // CREATE USER (REGISTER)
  async create(dto: CreateUserDto): Promise<User> {
    // Vérifie si l'email existe déjà en base
    const existing = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Hash du mot de passe avant sauvegarde
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Construction de l'entité User
    const user = this.repo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'user',
    });

    // Sauvegarde en base
    return this.repo.save(user);
  }

  // GET ALL : retourne tous les utilisateurs
  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  // GET ONE : recherche un utilisateur par id, lève une 404 s'il n'existe pas
  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  // FIND BY EMAIL (utilisé pour le login)
  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  // UPDATE : met à jour les champs de l'utilisateur (hash à nouveau le mot de passe si changé)
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = this.repo.merge(user, dto);
    return this.repo.save(updated);
  }

  // DELETE : supprime l'utilisateur
  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { deleted: true };
  }

  // Met à jour le refresh token associé à l'utilisateur (utilisé par AuthService)
  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const user = await this.findOne(userId);
    user.refreshToken = refreshToken;
    return this.repo.save(user);
  }

  // Permet de retrouver un user via son refresh token (optionnel)
  async findByRefreshToken(refreshToken: string) {
    return this.repo.findOne({ where: { refreshToken } });
  }
}
