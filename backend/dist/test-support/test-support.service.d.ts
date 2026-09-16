import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { FormSubmission } from '../forms/form-submission.entity';
import { Product } from '../products/product.entity';
export declare const SEED_PASSWORD = "Password123!";
export declare class TestSupportService {
    private readonly users;
    private readonly products;
    private readonly submissions;
    constructor(users: Repository<User>, products: Repository<Product>, submissions: Repository<FormSubmission>);
    reset(): Promise<{
        users: number;
        products: number;
        seedPassword: string;
        resetAt: string;
    }>;
    state(): Promise<{
        users: number;
        products: number;
        submissions: number;
    }>;
}
