import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MESSAGES } from '../common/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async verifyEmail(token: string): Promise<void> {
    const rec = await this.prisma.emailVerificationToken.findUnique({ where: { token } });
    if (!rec) throw new NotFoundException(MESSAGES.auth.emailVerificationFailed);

    if (rec.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { id: rec.id } });
      throw new BadRequestException(MESSAGES.auth.emailVerificationFailed);
    }

    await this.prisma.user.update({
      where: { id: rec.userId },
      data: { isEmailVerified: true },
    });

    await this.prisma.emailVerificationToken.delete({ where: { id: rec.id } });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException(MESSAGES.auth.invalidCredentials);
    if (!user.isEmailVerified) throw new BadRequestException(MESSAGES.auth.emailNotVerified);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException(MESSAGES.auth.invalidCredentials);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);

    return { accessToken };
  }
}
