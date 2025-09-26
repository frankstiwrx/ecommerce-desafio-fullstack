import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Verificação de e-mail com página HTML
  @Get('verify-email')
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.verifyEmail(token);
      return res.send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding:40px;">
            <h1 style="color: green;">✅ E-mail verificado com sucesso!</h1>
            <p>Agora você já pode fazer login normalmente.</p>
          </body>
        </html>
      `);
    } catch {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align:center; padding:40px;">
            <h1 style="color: red;">❌ Link inválido ou expirado</h1>
            <p>Tente registrar novamente para receber um novo link.</p>
          </body>
        </html>
      `);
    }
  }

  // Login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
