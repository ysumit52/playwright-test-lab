import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { FormsModule } from '../forms/forms.module';
import { ProductsModule } from '../products/products.module';
import { TestSupportController } from './test-support.controller';
import { TestSupportService } from './test-support.service';

@Module({
  imports: [AuthModule, ProductsModule, FormsModule],
  controllers: [TestSupportController],
  providers: [TestSupportService],
  exports: [TestSupportService],
})
export class TestSupportModule {}
