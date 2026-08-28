import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AUTH_COOKIE_NAME, type JwtPayload } from './auth.types';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard, Roles } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateCredentials(dto);
    const accessToken = this.authService.signToken(user);

    response.cookie(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.configService.get<string>('COOKIE_SECURE', 'false') === 'true',
      maxAge: this.authService.cookieMaxAgeMs,
      path: '/',
    });

    return {
      accessToken,
      user: this.authService.toPublicUser(user),
    };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    return { message: 'Signed out' };
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() payload: JwtPayload) {
    const user = await this.authService.findById(payload.sub);
    return this.authService.toPublicUser(user);
  }

  @Get('admin-area')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  adminArea(@CurrentUser() payload: JwtPayload) {
    return {
      message: `Welcome to the admin area, ${payload.email}`,
      secret: 'admin-only-value',
    };
  }
}
