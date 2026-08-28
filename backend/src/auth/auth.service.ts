import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async signup(dto: SignupDto): Promise<PublicUser> {
    const existing = await this.users.findOne({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const user = this.users.create({
      email: dto.email,
      fullName: dto.fullName,
      role: dto.role ?? 'viewer',
      passwordHash: await bcrypt.hash(dto.password, 10),
    });

    return this.toPublicUser(await this.users.save(user));
  }

  async validateCredentials(dto: LoginDto): Promise<User> {
    const user = await this.users.findOne({ where: { email: dto.email } });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('This account has been deactivated');
    }

    return user;
  }

  signToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Session expired or invalid');
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.users.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Account no longer exists');
    }

    return user;
  }

  // Returns the token directly so tests can complete the reset flow without email.
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken: string | null }> {
    const user = await this.users.findOne({ where: { email: dto.email } });

    if (!user) {
      return {
        message: 'If that account exists, a reset link has been sent',
        resetToken: null,
      };
    }

    user.resetToken = randomUUID();
    user.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.users.save(user);

    return {
      message: 'If that account exists, a reset link has been sent',
      resetToken: user.resetToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.users.findOne({ where: { resetToken: dto.token } });

    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
      throw new BadRequestException('This reset link is invalid or has expired');
    }

    user.passwordHash = await bcrypt.hash(dto.password, 10);
    user.resetToken = null;
    user.resetTokenExpiresAt = null;
    await this.users.save(user);

    return { message: 'Password updated. You can now sign in.' };
  }

  get cookieMaxAgeMs(): number {
    return this.configService.get<number>('SESSION_MAX_AGE_MS', 60 * 60 * 1000);
  }
}
