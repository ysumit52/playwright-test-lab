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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = require("node:crypto");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let AuthService = class AuthService {
    users;
    jwtService;
    configService;
    constructor(users, jwtService, configService) {
        this.users = users;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
        };
    }
    async signup(dto) {
        const existing = await this.users.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('An account with that email already exists');
        }
        const user = this.users.create({
            email: dto.email,
            fullName: dto.fullName,
            role: dto.role ?? 'viewer',
            passwordHash: await bcryptjs_1.default.hash(dto.password, 10),
        });
        return this.toPublicUser(await this.users.save(user));
    }
    async validateCredentials(dto) {
        const user = await this.users.findOne({ where: { email: dto.email } });
        if (!user || !(await bcryptjs_1.default.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('This account has been deactivated');
        }
        return user;
    }
    signToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Session expired or invalid');
        }
    }
    async findById(id) {
        const user = await this.users.findOne({ where: { id } });
        if (!user) {
            throw new common_1.UnauthorizedException('Account no longer exists');
        }
        return user;
    }
    async forgotPassword(dto) {
        const user = await this.users.findOne({ where: { email: dto.email } });
        if (!user) {
            return {
                message: 'If that account exists, a reset link has been sent',
                resetToken: null,
            };
        }
        user.resetToken = (0, node_crypto_1.randomUUID)();
        user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.users.save(user);
        return {
            message: 'If that account exists, a reset link has been sent',
            resetToken: user.resetToken,
        };
    }
    async resetPassword(dto) {
        const user = await this.users.findOne({ where: { resetToken: dto.token } });
        if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
            throw new common_1.BadRequestException('This reset link is invalid or has expired');
        }
        user.passwordHash = await bcryptjs_1.default.hash(dto.password, 10);
        user.resetToken = null;
        user.resetTokenExpiresAt = null;
        await this.users.save(user);
        return { message: 'Password updated. You can now sign in.' };
    }
    get cookieMaxAgeMs() {
        return this.configService.get('SESSION_MAX_AGE_MS', 60 * 60 * 1000);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map