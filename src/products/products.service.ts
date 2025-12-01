import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.repo.create(dto as Partial<Product>);
    return this.repo.save(product);
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Product ${id} not found`);
    return item;
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.findOne(id);
    const merged = this.repo.merge(existing, dto as Partial<Product>);
    return this.repo.save(merged);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
    return { deleted: true };
  }
}
