import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MESSAGES } from '../common/messages';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.q) where.name = { contains: String(query.q), mode: 'insensitive' };
    if (query.minPrice !== undefined)
      where.price = { ...(where.price ?? {}), gte: new Prisma.Decimal(Number(query.minPrice)) };
    if (query.maxPrice !== undefined)
      where.price = { ...(where.price ?? {}), lte: new Prisma.Decimal(Number(query.maxPrice)) };
    if (query.inStock === 'true') where.stock = { gt: 0 };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          createdAt: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const mapped = items.map((p) => ({ ...p, price: Number(p.price) }));
    return { page, limit, total, items: mapped };
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        createdAt: true,
      },
    });
    if (!p) throw new NotFoundException(MESSAGES.product.notFound);
    return { ...p, price: Number(p.price) };
  }

  async create(dto: any) {
    const p = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        price: new Prisma.Decimal(dto.price),
        stock: dto.stock,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        createdAt: true,
      },
    });
    return { ...p, price: Number(p.price) };
  }

  async update(id: string, dto: any) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description ?? null;
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.stock !== undefined) data.stock = dto.stock;

    try {
      const p = await this.prisma.product.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          createdAt: true,
        },
      });
      return { ...p, price: Number(p.price) };
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException(MESSAGES.product.notFound);
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({ where: { id } });
      return { ok: true };
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException(MESSAGES.product.notFound);
      throw e;
    }
  }
}
