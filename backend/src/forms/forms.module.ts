import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormSubmission } from './form-submission.entity';
import { FormsController } from './forms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormSubmission])],
  controllers: [FormsController],
  exports: [TypeOrmModule],
})
export class FormsModule {}
