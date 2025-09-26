import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '../mail/mailer.service';







@Injectable()
export class UsersService {

  

constructor(
  private readonly prisma: PrismaService,
  private readonly mailer: MailerService,
) {}


  // users.service.ts
async create(dto: CreateUserDto) {
  const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (exists) throw new ConflictException('E-mail já está em uso');

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: 'USER',
      isEmailVerified: false,
    },
    select: { id: true, name: true, email: true, role: true, isEmailVerified: true, createdAt: true },
  });

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await this.prisma.emailVerificationToken.create({ data: { userId: user.id, token, expiresAt } });
  console.log(`[email] GET /auth/verify-email?token=${token}`);
  await this.mailer.sendVerificationEmail(user.email, token);


  return user;
}


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
