import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInformation() {
    return {
      name: 'Playwright Test Lab API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        products: '/api/products',
        forms: '/api/forms',
        async: '/api/async',
        testSupport: '/api/test',
      },
    };
  }
}