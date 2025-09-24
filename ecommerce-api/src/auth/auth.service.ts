import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
constructor(
  private readonly prisma: PrismaService,
  private readonly jwt: JwtService,
) {}

  async verifyEmail(token: string): Promise<void> {
    const rec = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!rec) throw new NotFoundException('Token inválido');
    if (rec.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { id: rec.id } });
      throw new BadRequestException('Token expirado');
    }
    await this.prisma.user.update({ where: { id: rec.userId }, data: { isEmailVerified: true } });
    await this.prisma.emailVerificationToken.delete({ where: { id: rec.id } });
  }

  async login(email: string, password: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedException('Credenciais inválidas');
  if (!user.isEmailVerified) throw new BadRequestException('E-mail não verificado');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new UnauthorizedException('Credenciais inválidas');

  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = await this.jwt.signAsync(payload);

  return { accessToken };
}

  
}

