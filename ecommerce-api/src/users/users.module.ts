import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // ← adicione isto

@Module({
  imports: [PrismaModule], // ← e isto
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
