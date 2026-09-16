import { BulkIdsDto, BulkStatusDto, CreateProductDto, QueryProductsDto, UpdateProductDto } from './product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: QueryProductsDto): Promise<import("./products.service").PaginatedProducts>;
    categories(): {
        categories: readonly ["Electronics", "Apparel", "Home", "Outdoors", "Toys"];
    };
    categoryCounts(): Promise<{
        category: string;
        count: number;
    }[]>;
    findOne(id: string): Promise<import("./products.service").ProductView>;
    create(dto: CreateProductDto): Promise<import("./products.service").ProductView>;
    update(id: string, dto: UpdateProductDto): Promise<import("./products.service").ProductView>;
    bulkUpdateStatus(dto: BulkStatusDto): Promise<{
        updated: number;
    }>;
    bulkRemove(dto: BulkIdsDto): Promise<{
        deleted: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        deleted: true;
    }>;
}
