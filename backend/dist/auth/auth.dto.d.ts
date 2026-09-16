import type { UserRole } from './user.entity';
export declare class SignupDto {
    email: string;
    password: string;
    fullName: string;
    role?: UserRole;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    password: string;
}
