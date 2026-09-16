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
exports.JwtAuthGuard = exports.Roles = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_types_1 = require("./auth.types");
const auth_service_1 = require("./auth.service");
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
let JwtAuthGuard = class JwtAuthGuard {
    authService;
    reflector;
    constructor(authService, reflector) {
        this.authService = authService;
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        request.user = this.authService.verifyToken(token);
        const requiredRoles = this.reflector.getAllAndOverride(exports.ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (requiredRoles?.length && !requiredRoles.includes(request.user.role)) {
            throw new common_1.ForbiddenException(`Requires one of the following roles: ${requiredRoles.join(', ')}`);
        }
        return true;
    }
    extractToken(request) {
        const header = request.headers.authorization;
        const authorization = Array.isArray(header) ? header[0] : header;
        if (authorization?.startsWith('Bearer ')) {
            return authorization.slice('Bearer '.length);
        }
        return request.cookies?.[auth_types_1.AUTH_COOKIE_NAME] ?? null;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map