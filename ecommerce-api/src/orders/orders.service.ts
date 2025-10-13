import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user) throw new ForbiddenException('Usuário não encontrado.');
    if (user.role === 'ADMIN')
      throw new ForbiddenException('Apenas usuários comuns podem finalizar compra.');

    return this.prisma
      .$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            items: {
              include: {
                product: { select: { id: true, name: true, price: true, stock: true } },
              },
            },
          },
        });

        if (!cart || cart.items.length === 0) {
          throw new BadRequestException('Carrinho vazio.');
        }

        for (const it of cart.items) {
          if (it.qty > it.product.stock) {
            throw new BadRequestException(`Estoque insuficiente para: ${it.product.name}`);
          }
        }

        const total = cart.items.reduce((acc, it) => {
          const unitRaw = (it as any).unitPriceSnapshot ?? it.product.price;
          const unitNum = unitRaw instanceof Prisma.Decimal ? Number(unitRaw) : Number(unitRaw);
          return acc + unitNum * it.qty;
        }, 0);

        const order = await tx.order.create({
          data: {
            userId,
            total: new Prisma.Decimal(total),
            status: 'PENDING',
            paymentStatus: 'NOT_PAID',
          },
          select: { id: true },
        });

        for (const it of cart.items) {
          const unitRaw = (it as any).unitPriceSnapshot ?? it.product.price;
          const unitDec = unitRaw instanceof Prisma.Decimal ? unitRaw : new Prisma.Decimal(unitRaw);

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: it.product.id,
              qty: it.qty,
              unitPrice: unitDec,
            },
          });

          await tx.product.update({
            where: { id: it.product.id },
            data: { stock: { decrement: it.qty } },
          });
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return {
          id: order.id,
          total,
          items: cart.items.map((it) => ({
            productId: it.product.id,
            name: it.product.name,
            qty: it.qty,
          })),
        };
      })
      .catch((e) => {
        if (e instanceof BadRequestException || e instanceof ForbiddenException) throw e;
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException('Não foi possível finalizar o pedido.');
        }
        throw e;
      });
  }
}
