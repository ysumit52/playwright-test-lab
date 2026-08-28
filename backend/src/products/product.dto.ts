import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { PRODUCT_CATEGORIES, type ProductStatus } from './product.entity';

export const PRODUCT_SORT_FIELDS = [
  'name',
  'sku',
  'category',
  'price',
  'stock',
  'status',
  'createdAt',
] as const;

export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(80)
  name!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @MinLength(3, { message: 'SKU must be at least 3 characters' })
  @MaxLength(24)
  sku!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(PRODUCT_CATEGORIES as readonly string[], {
    message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
  })
  category!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1_000_000)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsIn(['draft', 'active', 'archived'])
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(PRODUCT_CATEGORIES as readonly string[])
  category?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1_000_000)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsIn(['draft', 'active', 'archived'])
  status?: ProductStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class QueryProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(PRODUCT_CATEGORIES as readonly string[])
  category?: string;

  @IsOptional()
  @IsIn(['draft', 'active', 'archived'])
  status?: ProductStatus;

  @IsOptional()
  @IsIn(PRODUCT_SORT_FIELDS as readonly string[])
  sortBy?: ProductSortField;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  // Artificial latency so tests can exercise spinners and slow-loading states.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10_000)
  delayMs?: number;
}

export class BulkIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids!: string[];
}

export class BulkStatusDto extends BulkIdsDto {
  @IsIn(['draft', 'active', 'archived'])
  status!: ProductStatus;
}
