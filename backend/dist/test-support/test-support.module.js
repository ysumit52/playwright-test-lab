"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSupportModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const forms_module_1 = require("../forms/forms.module");
const products_module_1 = require("../products/products.module");
const test_support_controller_1 = require("./test-support.controller");
const test_support_service_1 = require("./test-support.service");
let TestSupportModule = class TestSupportModule {
};
exports.TestSupportModule = TestSupportModule;
exports.TestSupportModule = TestSupportModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, products_module_1.ProductsModule, forms_module_1.FormsModule],
        controllers: [test_support_controller_1.TestSupportController],
        providers: [test_support_service_1.TestSupportService],
        exports: [test_support_service_1.TestSupportService],
    })
], TestSupportModule);
//# sourceMappingURL=test-support.module.js.map