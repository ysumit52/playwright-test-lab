import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import type { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto } from './auth.dto';
import type { JwtPayload } from './auth.types';
import { User } from './user.entity';
export interface PublicUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}
export declare class AuthService {
    private readonly users;
    private readonly jwtService;
    private readonly configService;
    constructor(users: Repository<User>, jwtService: JwtService, configService: ConfigService);
    toPublicUser(user: User): PublicUser;
    signup(dto: SignupDto): Promise<PublicUser>;
    validateCredentials(dto: LoginDto): Promise<User>;
    signToken(user: User): string;
    verifyToken(token: string): JwtPayload;
    findById(id: string): Promise<User>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken: string | null;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    get cookieMaxAgeMs(): number;
}
