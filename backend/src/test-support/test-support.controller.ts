import { Controller, Get, HttpCode, Post } from '@nestjs/common';

import { SEED_PASSWORD, TestSupportService } from './test-support.service';

@Controller('test')
export class TestSupportController {
  constructor(private readonly testSupportService: TestSupportService) {}

  @Post('reset')
  @HttpCode(200)
  reset() {
    return this.testSupportService.reset();
  }

  @Get('state')
  state() {
    return this.testSupportService.state();
  }

  @Get('accounts')
  accounts() {
    return {
      password: SEED_PASSWORD,
      users: [
        { email: 'admin@lab.test', role: 'admin' },
        { email: 'editor@lab.test', role: 'editor' },
        { email: 'viewer@lab.test', role: 'viewer' },
        { email: 'disabled@lab.test', role: 'viewer (deactivated)' },
      ],
    };
  }
}
