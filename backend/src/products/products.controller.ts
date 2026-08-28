import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard, Roles } from '../auth/jwt-auth.guard';
import {
  BulkIdsDto,
  BulkStatusDto,
  CreateProductDto,
  QueryProductsDto,
  UpdateProductDto,
} from './product.dto';
import { PRODUCT_CATEGORIES } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  categories() {
    return {
      categories: PRODUCT_CATEGORIES,
    };
  }

  @Get('category-counts')
  categoryCounts() {
    return this.productsService.categoriesWithCounts();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('admin', 'editor')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Patch('bulk/status')
  @HttpCode(200)
  @Roles('admin', 'editor')
  @UseGuards(JwtAuthGuard)
  bulkUpdateStatus(@Body() dto: BulkStatusDto) {
    return this.productsService.bulkUpdateStatus(dto);
  }

  @Delete('bulk')
  @HttpCode(200)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  bulkRemove(@Body() dto: BulkIdsDto) {
    return this.productsService.bulkRemove(dto);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
