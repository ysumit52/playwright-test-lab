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
exports.AsyncController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const rxjs_1 = require("rxjs");
const SEARCH_CORPUS = [
    'Aurora Headphones',
    'Aurora Speaker',
    'Trailhead Backpack',
    'Trailhead Tent',
    'Loom Knit Sweater',
    'Loom Wool Scarf',
    'Harbor Desk Lamp',
    'Harbor Floor Lamp',
    'Meadow Yoga Mat',
    'Meadow Water Bottle',
    'Pixel Drone',
    'Pixel Action Camera',
];
class SearchQueryDto {
    q;
    delayMs;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchQueryDto.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10_000),
    __metadata("design:type", Number)
], SearchQueryDto.prototype, "delayMs", void 0);
class FeedQueryDto {
    cursor;
    limit;
    delayMs;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FeedQueryDto.prototype, "cursor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], FeedQueryDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10_000),
    __metadata("design:type", Number)
], FeedQueryDto.prototype, "delayMs", void 0);
class DelayQueryDto {
    ms;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30_000),
    __metadata("design:type", Number)
], DelayQueryDto.prototype, "ms", void 0);
const TOTAL_FEED_ITEMS = 120;
let AsyncController = class AsyncController {
    async search(query) {
        await this.wait(query.delayMs ?? 400);
        const term = (query.q ?? '').trim().toLowerCase();
        const results = term
            ? SEARCH_CORPUS.filter((item) => item.toLowerCase().includes(term))
            : [];
        return { query: term, count: results.length, results };
    }
    async feed(query) {
        await this.wait(query.delayMs ?? 300);
        const cursor = query.cursor ?? 0;
        const limit = query.limit ?? 20;
        const items = Array.from({ length: Math.max(0, Math.min(limit, TOTAL_FEED_ITEMS - cursor)) }, (_, index) => {
            const id = cursor + index + 1;
            return {
                id,
                title: `Feed item ${id}`,
                body: `Deterministic content for item ${id}.`,
            };
        });
        const nextCursor = cursor + items.length;
        return {
            items,
            nextCursor: nextCursor < TOTAL_FEED_ITEMS ? nextCursor : null,
            total: TOTAL_FEED_ITEMS,
        };
    }
    async slow(query) {
        const ms = query.ms ?? 3000;
        await this.wait(ms);
        return { message: `Responded after ${ms}ms`, delayedMs: ms };
    }
    ticker() {
        return (0, rxjs_1.interval)(1000).pipe((0, rxjs_1.map)((tick) => ({
            data: { tick: tick + 1, timestamp: new Date().toISOString() },
        })));
    }
    wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.AsyncController = AsyncController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchQueryDto]),
    __metadata("design:returntype", Promise)
], AsyncController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FeedQueryDto]),
    __metadata("design:returntype", Promise)
], AsyncController.prototype, "feed", null);
__decorate([
    (0, common_1.Get)('slow'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DelayQueryDto]),
    __metadata("design:returntype", Promise)
], AsyncController.prototype, "slow", null);
__decorate([
    (0, common_1.Sse)('ticker'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Function)
], AsyncController.prototype, "ticker", null);
exports.AsyncController = AsyncController = __decorate([
    (0, common_1.Controller)('async')
], AsyncController);
//# sourceMappingURL=async.controller.js.map