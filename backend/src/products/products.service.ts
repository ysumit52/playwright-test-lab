import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import type {
  BulkIdsDto,
  BulkStatusDto,
  CreateProductDto,
  QueryProductsDto,
  UpdateProductDto,
} from './product.dto';
import { Product } from './product.entity';

export interface ProductView {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  items: ProductView[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  private toView(product: Product): ProductView {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      stock: product.stock,
      status: product.status,
      featured: product.featured,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async findAll(query: QueryProductsDto): Promise<PaginatedProducts> {
    if (query.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, query.delayMs));
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const baseWhere = {
      ...(query.category ? { category: query.category } : {}),
      ...(query.status ? { status: query.status } : {}),
    };

    const where = query.search
      ? [
          { ...baseWhere, name: ILike(`%${query.search}%`) },
          { ...baseWhere, sku: ILike(`%${query.search}%`) },
        ]
      : baseWhere;

    const [rows, total] = await this.products.findAndCount({
      where,
      order: { [sortBy]: sortDir.toUpperCase() as 'ASC' | 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: rows.map((row) => this.toView(row)),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  async findOne(id: string): Promise<ProductView> {
    const product = await this.products.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} was not found`);
    }

    return this.toView(product);
  }

  async create(dto: CreateProductDto): Promise<ProductView> {
    await this.assertSkuAvailable(dto.sku);

    const product = this.products.create({
      ...dto,
      description: dto.description ?? '',
      price: dto.price.toFixed(2),
      status: dto.status ?? 'draft',
      featured: dto.featured ?? false,
    });

    return this.toView(await this.products.save(product));
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductView> {
    const product = await this.products.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product ${id} was not found`);
    }

    if (dto.sku && dto.sku !== product.sku) {
      await this.assertSkuAvailable(dto.sku);
    }

    Object.assign(product, {
      ...dto,
      ...(dto.price === undefined ? {} : { price: dto.price.toFixed(2) }),
    });

    return this.toView(await this.products.save(product));
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const result = await this.products.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Product ${id} was not found`);
    }

    return { id, deleted: true };
  }

  async bulkRemove(dto: BulkIdsDto): Promise<{ deleted: number }> {
    const result = await this.products.delete({ id: In(dto.ids) });
    return { deleted: result.affected ?? 0 };
  }

  async bulkUpdateStatus(dto: BulkStatusDto): Promise<{ updated: number }> {
    const result = await this.products.update(
      { id: In(dto.ids) },
      { status: dto.status },
    );

    return { updated: result.affected ?? 0 };
  }

  async categoriesWithCounts(): Promise<{ category: string; count: number }[]> {
    const rows = await this.products
      .createQueryBuilder('product')
      .select('product.category', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('product.category')
      .orderBy('product.category', 'ASC')
      .getRawMany<{ category: string; count: string }>();

    return rows.map((row) => ({
      category: row.category,
      count: Number(row.count),
    }));
  }

  private async assertSkuAvailable(sku: string): Promise<void> {
    const existing = await this.products.findOne({ where: { sku } });

    if (existing) {
      throw new ConflictException(`SKU "${sku}" is already in use`);
    }
  }
}
