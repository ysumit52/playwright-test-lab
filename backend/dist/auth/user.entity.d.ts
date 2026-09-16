export type UserRole = 'admin' | 'editor' | 'viewer';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    resetToken: string | null;
    resetTokenExpiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
