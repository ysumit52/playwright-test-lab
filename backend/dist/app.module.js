"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const async_module_1 = require("./async/async.module");
const auth_module_1 = require("./auth/auth.module");
const forms_module_1 = require("./forms/forms.module");
const products_module_1 = require("./products/products.module");
const test_support_module_1 = require("./test-support/test-support.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    database: configService.get('DB_NAME', 'playwright_lab'),
                    username: configService.get('DB_USERNAME', 'playwright_user'),
                    password: configService.get('DB_PASSWORD', 'playwright_password'),
                    autoLoadEntities: true,
                    synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
                    logging: configService.get('DB_LOGGING', 'false') === 'true',
                }),
            }),
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            forms_module_1.FormsModule,
            async_module_1.AsyncModule,
            test_support_module_1.TestSupportModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map