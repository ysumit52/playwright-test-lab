import type { UserRole } from './user.entity';
export declare const AUTH_COOKIE_NAME = "lab_session";
export interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}
export interface AuthenticatedRequest {
    user?: JwtPayload;
    cookies?: Record<string, string>;
    headers: Record<string, string | string[] | undefined>;
}
