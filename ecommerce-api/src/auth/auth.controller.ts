import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // (já existente)
  @Get('verify-email')
  @HttpCode(204)
  async verify(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
  }

  // NOVO: login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
