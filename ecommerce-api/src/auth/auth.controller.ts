import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { MESSAGES } from '../common/messages';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify-email')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyEmail(token);
      return res.send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding:40px;">
            <h1 style="color: green;">${MESSAGES.auth.emailVerified}</h1>
            <p>You can now log in normally.</p>
          </body>
        </html>
      `);
    } catch {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding:40px;">
            <h1 style="color: red;">${MESSAGES.auth.emailVerificationFailed}</h1>
            <p>Please register again to receive a new verification link.</p>
          </body>
        </html>
      `);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
