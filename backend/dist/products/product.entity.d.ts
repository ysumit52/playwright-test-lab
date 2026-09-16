export type ProductStatus = 'draft' | 'active' | 'archived';
export declare const PRODUCT_CATEGORIES: readonly ["Electronics", "Apparel", "Home", "Outdoors", "Toys"];
export declare class Product {
    id: string;
    name: string;
    sku: string;
    description: string;
    category: string;
    price: string;
    stock: number;
    status: ProductStatus;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}
