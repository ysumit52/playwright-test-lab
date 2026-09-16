"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const test_support_service_1 = require("./test-support/test-support.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:4200');
    app.setGlobalPrefix('api');
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Test-Run-Id'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableShutdownHooks();
    if (configService.get('SEED_ON_BOOT', 'true') === 'true') {
        await app.get(test_support_service_1.TestSupportService).reset();
    }
    const port = configService.get('API_PORT', 3000);
    await app.listen(port, '0.0.0.0');
    console.log(`API running at http://localhost:${port}/api`);
}
void bootstrap();
//# sourceMappingURL=main.js.map