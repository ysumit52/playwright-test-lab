import { type ProductStatus } from './product.entity';
export declare const PRODUCT_SORT_FIELDS: readonly ["name", "sku", "category", "price", "stock", "status", "createdAt"];
export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];
export declare class CreateProductDto {
    name: string;
    sku: string;
    description?: string;
    category: string;
    price: number;
    stock: number;
    status?: ProductStatus;
    featured?: boolean;
}
export declare class UpdateProductDto {
    name?: string;
    sku?: string;
    description?: string;
    category?: string;
    price?: number;
    stock?: number;
    status?: ProductStatus;
    featured?: boolean;
}
export declare class QueryProductsDto {
    search?: string;
    category?: string;
    status?: ProductStatus;
    sortBy?: ProductSortField;
    sortDir?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
    delayMs?: number;
}
export declare class BulkIdsDto {
    ids: string[];
}
export declare class BulkStatusDto extends BulkIdsDto {
    status: ProductStatus;
}
