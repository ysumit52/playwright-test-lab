"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    products;
    constructor(products) {
        this.products = products;
    }
    toView(product) {
        return {
            id: product.id,
            name: product.name,
            sku: product.sku,
            description: product.description,
            category: product.category,
            price: Number(product.price),
            stock: product.stock,
            status: product.status,
            featured: product.featured,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };
    }
    async findAll(query) {
        if (query.delayMs) {
            await new Promise((resolve) => setTimeout(resolve, query.delayMs));
        }
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const sortBy = query.sortBy ?? 'createdAt';
        const sortDir = query.sortDir ?? 'desc';
        const baseWhere = {
            ...(query.category ? { category: query.category } : {}),
            ...(query.status ? { status: query.status } : {}),
        };
        const where = query.search
            ? [
                { ...baseWhere, name: (0, typeorm_2.ILike)(`%${query.search}%`) },
                { ...baseWhere, sku: (0, typeorm_2.ILike)(`%${query.search}%`) },
            ]
            : baseWhere;
        const [rows, total] = await this.products.findAndCount({
            where,
            order: { [sortBy]: sortDir.toUpperCase() },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            items: rows.map((row) => this.toView(row)),
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        };
    }
    async findOne(id) {
        const product = await this.products.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${id} was not found`);
        }
        return this.toView(product);
    }
    async create(dto) {
        await this.assertSkuAvailable(dto.sku);
        const product = this.products.create({
            ...dto,
            description: dto.description ?? '',
            price: dto.price.toFixed(2),
            status: dto.status ?? 'draft',
            featured: dto.featured ?? false,
        });
        return this.toView(await this.products.save(product));
    }
    async update(id, dto) {
        const product = await this.products.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`Product ${id} was not found`);
        }
        if (dto.sku && dto.sku !== product.sku) {
            await this.assertSkuAvailable(dto.sku);
        }
        Object.assign(product, {
            ...dto,
            ...(dto.price === undefined ? {} : { price: dto.price.toFixed(2) }),
        });
        return this.toView(await this.products.save(product));
    }
    async remove(id) {
        const result = await this.products.delete(id);
        if (!result.affected) {
            throw new common_1.NotFoundException(`Product ${id} was not found`);
        }
        return { id, deleted: true };
    }
    async bulkRemove(dto) {
        const result = await this.products.delete({ id: (0, typeorm_2.In)(dto.ids) });
        return { deleted: result.affected ?? 0 };
    }
    async bulkUpdateStatus(dto) {
        const result = await this.products.update({ id: (0, typeorm_2.In)(dto.ids) }, { status: dto.status });
        return { updated: result.affected ?? 0 };
    }
    async categoriesWithCounts() {
        const rows = await this.products
            .createQueryBuilder('product')
            .select('product.category', 'category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('product.category')
            .orderBy('product.category', 'ASC')
            .getRawMany();
        return rows.map((row) => ({
            category: row.category,
            count: Number(row.count),
        }));
    }
    async assertSkuAvailable(sku) {
        const existing = await this.products.findOne({ where: { sku } });
        if (existing) {
            throw new common_1.ConflictException(`SKU "${sku}" is already in use`);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map