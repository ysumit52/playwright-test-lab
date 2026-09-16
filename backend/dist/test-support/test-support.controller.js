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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSupportController = void 0;
const common_1 = require("@nestjs/common");
const test_support_service_1 = require("./test-support.service");
let TestSupportController = class TestSupportController {
    testSupportService;
    constructor(testSupportService) {
        this.testSupportService = testSupportService;
    }
    reset() {
        return this.testSupportService.reset();
    }
    state() {
        return this.testSupportService.state();
    }
    accounts() {
        return {
            password: test_support_service_1.SEED_PASSWORD,
            users: [
                { email: 'admin@lab.test', role: 'admin' },
                { email: 'editor@lab.test', role: 'editor' },
                { email: 'viewer@lab.test', role: 'viewer' },
                { email: 'disabled@lab.test', role: 'viewer (deactivated)' },
            ],
        };
    }
};
exports.TestSupportController = TestSupportController;
__decorate([
    (0, common_1.Post)('reset'),
    (0, common_1.HttpCode)(200),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSupportController.prototype, "reset", null);
__decorate([
    (0, common_1.Get)('state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSupportController.prototype, "state", null);
__decorate([
    (0, common_1.Get)('accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestSupportController.prototype, "accounts", null);
exports.TestSupportController = TestSupportController = __decorate([
    (0, common_1.Controller)('test'),
    __metadata("design:paramtypes", [test_support_service_1.TestSupportService])
], TestSupportController);
//# sourceMappingURL=test-support.controller.js.map