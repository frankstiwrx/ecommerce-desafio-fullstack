import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { MailerModule } from './mail/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- carrega .env
    PrismaModule,
    MailerModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
