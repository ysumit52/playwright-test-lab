import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import type { UserRole } from './user.entity';

const trimmedLowerCase = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class SignupDto {
  @Transform(trimmedLowerCase)
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Full name is required' })
  fullName!: string;

  @IsOptional()
  @IsIn(['admin', 'editor', 'viewer'])
  role?: UserRole;
}

export class LoginDto {
  @Transform(trimmedLowerCase)
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;
}

export class ForgotPasswordDto {
  @Transform(trimmedLowerCase)
  @IsEmail({}, { message: 'Enter a valid email address' })
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
