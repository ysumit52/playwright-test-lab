import { DataSource } from 'typeorm';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly dataSource;
    constructor(appService: AppService, dataSource: DataSource);
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
    getHealth(): {
        status: string;
        database: string;
        timestamp: string;
    };
}
