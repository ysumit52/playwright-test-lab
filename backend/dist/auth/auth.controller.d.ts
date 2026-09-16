import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto } from './auth.dto';
import { AuthService } from './auth.service';
import { type JwtPayload } from './auth.types';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    signup(dto: SignupDto): Promise<import("./auth.service").PublicUser>;
    login(dto: LoginDto, response: Response): Promise<{
        accessToken: string;
        user: import("./auth.service").PublicUser;
    }>;
    logout(response: Response): {
        message: string;
    };
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken: string | null;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    me(payload: JwtPayload): Promise<import("./auth.service").PublicUser>;
    adminArea(payload: JwtPayload): {
        message: string;
        secret: string;
    };
}
