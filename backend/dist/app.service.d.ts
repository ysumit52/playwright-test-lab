export declare class AppService {
    getApiInformation(): {
        name: string;
        version: string;
        status: string;
        endpoints: {
            health: string;
            auth: string;
            products: string;
            forms: string;
            async: string;
            testSupport: string;
        };
    };
}
