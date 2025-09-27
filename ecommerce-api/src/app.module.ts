import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { MailerModule } from './mail/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.CACHE_TTL_SECONDS) || 60,
    }),
    PrismaModule,
    MailerModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
