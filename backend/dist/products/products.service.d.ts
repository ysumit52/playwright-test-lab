import { Repository } from 'typeorm';
import type { BulkIdsDto, BulkStatusDto, CreateProductDto, QueryProductsDto, UpdateProductDto } from './product.dto';
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
export declare class ProductsService {
    private readonly products;
    constructor(products: Repository<Product>);
    private toView;
    findAll(query: QueryProductsDto): Promise<PaginatedProducts>;
    findOne(id: string): Promise<ProductView>;
    create(dto: CreateProductDto): Promise<ProductView>;
    update(id: string, dto: UpdateProductDto): Promise<ProductView>;
    remove(id: string): Promise<{
        id: string;
        deleted: true;
    }>;
    bulkRemove(dto: BulkIdsDto): Promise<{
        deleted: number;
    }>;
    bulkUpdateStatus(dto: BulkStatusDto): Promise<{
        updated: number;
    }>;
    categoriesWithCounts(): Promise<{
        category: string;
        count: number;
    }[]>;
    private assertSkuAvailable;
}
