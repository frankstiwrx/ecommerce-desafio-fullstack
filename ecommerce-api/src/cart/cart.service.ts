import { PrismaService } from '../prisma/prisma.service';
import {Injectable,  BadRequestException,  NotFoundException,  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';


@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }

  private mapCart(cart: any) {
    const items = cart.items.map((it: any) => ({
      id: it.id,
      productId: it.productId,
      qty: it.qty,
      unitPrice: Number(it.unitPriceSnapshot),
      subtotal: Number(it.unitPriceSnapshot) * it.qty,
      product: it.product ? {
        id: it.product.id,
        name: it.product.name,
      } : undefined,
    }));
    const total = items.reduce((s: number, i: any) => s + i.subtotal, 0);
    return { id: cart.id, userId: cart.userId, items, total };
  }

  async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: { select: { id: true, name: true } } } } },
      });
    }
    return this.mapCart(cart);
  }

  async addItem(userId: string, dto: { productId: string; qty: number }) {
    if (dto.qty <= 0) throw new BadRequestException('Quantidade inválida');

    // produto existe?
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, stock: true, price: true, name: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (dto.qty > product.stock) throw new BadRequestException('Estoque insuficiente');

    // garante carrinho do usuário
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // já existe item do mesmo produto?
    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    });

    if (existing) {
      const newQty = existing.qty + dto.qty;
      if (newQty > product.stock) throw new BadRequestException('Estoque insuficiente');
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: newQty,
          unitPriceSnapshot: product.price, // mantém snapshot atual
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          qty: dto.qty,
          unitPriceSnapshot: new Prisma.Decimal(product.price),
        },
      });
    }

    // retorna carrinho atualizado
    const updated = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
    return this.mapCart(updated!);
  }


  async updateItem(userId: string, itemId: string, qty: number) {
    if (qty <= 0) throw new BadRequestException('Quantidade inválida');

    // garante que item existe e pertence ao carrinho do usuário
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item não encontrado');

    const cart = await this.prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart || cart.userId !== userId) throw new ForbiddenException('Acesso negado');

    // checa estoque do produto
    const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (qty > product.stock) throw new BadRequestException('Estoque insuficiente');

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { qty, unitPriceSnapshot: product.price },
    });

    const updated = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
    return this.mapCart(updated!);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Item não encontrado');

    const cart = await this.prisma.cart.findUnique({ where: { id: item.cartId } });
    if (!cart || cart.userId !== userId) throw new ForbiddenException('Acesso negado');

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    const updated = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: { select: { id: true, name: true } } } } },
    });
    return this.mapCart(updated!);
  }



}
