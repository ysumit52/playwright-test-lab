import { TestSupportService } from './test-support.service';
export declare class TestSupportController {
    private readonly testSupportService;
    constructor(testSupportService: TestSupportService);
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
    accounts(): {
        password: string;
        users: {
            email: string;
            role: string;
        }[];
    };
}
