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
    // Check if email already exists
    const existing = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Build the user
    const user = this.repo.create({
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'user',
    });

    // Save in DB
    return this.repo.save(user);
  }

  // GET ALL
  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  // GET ONE
  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  // FIND BY EMAIL (used in login)
  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  // UPDATE
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = this.repo.merge(user, dto);
    return this.repo.save(updated);
  }

  // DELETE
  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { deleted: true };
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const user = await this.findOne(userId);
    user.refreshToken = refreshToken;
    return this.repo.save(user);
  }

  async findByRefreshToken(refreshToken: string) {
    return this.repo.findOne({ where: { refreshToken } });
  }
}
