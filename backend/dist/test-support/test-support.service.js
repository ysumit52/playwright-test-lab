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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSupportService = exports.SEED_PASSWORD = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/user.entity");
const form_submission_entity_1 = require("../forms/form-submission.entity");
const product_entity_1 = require("../products/product.entity");
exports.SEED_PASSWORD = 'Password123!';
const SEED_USERS = [
    { email: 'admin@lab.test', fullName: 'Ada Admin', role: 'admin' },
    { email: 'editor@lab.test', fullName: 'Eli Editor', role: 'editor' },
    { email: 'viewer@lab.test', fullName: 'Vera Viewer', role: 'viewer' },
    {
        email: 'disabled@lab.test',
        fullName: 'Dana Disabled',
        role: 'viewer',
        isActive: false,
    },
];
const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Outdoors', 'Toys'];
const STATUSES = ['draft', 'active', 'archived'];
const PRODUCT_NAMES = [
    'Aurora Headphones',
    'Trailhead Backpack',
    'Loom Knit Sweater',
    'Harbor Desk Lamp',
    'Meadow Yoga Mat',
    'Pixel Drone',
    'Cobalt Water Bottle',
    'Fern Ceramic Mug',
    'Summit Trekking Poles',
    'Nimbus Rain Jacket',
    'Quartz Wall Clock',
    'Ember Cast Iron Pan',
    'Willow Throw Blanket',
    'Orbit Puzzle Cube',
    'Lantern Reading Light',
    'Basalt Chef Knife',
    'Cirrus Bluetooth Speaker',
    'Terra Hiking Boots',
    'Halo Ring Light',
    'Drift Skateboard',
    'Vertex Mechanical Keyboard',
    'Solstice Sunglasses',
    'Anchor Leather Wallet',
    'Prairie Picnic Basket',
    'Zenith Smart Scale',
];
let TestSupportService = class TestSupportService {
    users;
    products;
    submissions;
    constructor(users, products, submissions) {
        this.users = users;
        this.products = products;
        this.submissions = submissions;
    }
    async reset() {
        await this.submissions.clear();
        await this.products.clear();
        await this.users.clear();
        const passwordHash = await bcryptjs_1.default.hash(exports.SEED_PASSWORD, 10);
        await this.users.save(SEED_USERS.map((seed) => this.users.create({
            email: seed.email,
            fullName: seed.fullName,
            role: seed.role,
            isActive: seed.isActive ?? true,
            passwordHash,
        })));
        await this.products.save(PRODUCT_NAMES.map((name, index) => this.products.create({
            name,
            sku: `SKU-${String(index + 1).padStart(4, '0')}`,
            description: `Deterministic seed product #${index + 1} for automated tests.`,
            category: CATEGORIES[index % CATEGORIES.length],
            price: (19.99 + index * 7.5).toFixed(2),
            stock: (index * 3) % 47,
            status: STATUSES[index % STATUSES.length],
            featured: index % 4 === 0,
        })));
        return {
            users: SEED_USERS.length,
            products: PRODUCT_NAMES.length,
            seedPassword: exports.SEED_PASSWORD,
            resetAt: new Date().toISOString(),
        };
    }
    async state() {
        const [users, products, submissions] = await Promise.all([
            this.users.count(),
            this.products.count(),
            this.submissions.count(),
        ]);
        return { users, products, submissions };
    }
};
exports.TestSupportService = TestSupportService;
exports.TestSupportService = TestSupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(form_submission_entity_1.FormSubmission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TestSupportService);
//# sourceMappingURL=test-support.service.js.map