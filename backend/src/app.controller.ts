import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getApiInformation() {
    return this.appService.getApiInformation();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      database: this.dataSource.isInitialized ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}