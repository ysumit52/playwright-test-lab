import { Module } from '@nestjs/common';

import { AsyncController } from './async.controller';

@Module({
  controllers: [AsyncController],
})
export class AsyncModule {}
