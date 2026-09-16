import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import type { UserRole } from './user.entity';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common", { with: { "resolution-mode": "import" } }).CustomDecorator<string>;
export declare class JwtAuthGuard implements CanActivate {
    private readonly authService;
    private readonly reflector;
    constructor(authService: AuthService, reflector: Reflector);
    canActivate(context: ExecutionContext): boolean;
    private extractToken;
}
