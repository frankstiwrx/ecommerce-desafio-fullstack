import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.q) where.name = { contains: String(query.q), mode: 'insensitive' };
    if (query.minPrice) where.price = { ...(where.price ?? {}), gte: query.minPrice };
    if (query.maxPrice) where.price = { ...(where.price ?? {}), lte: query.maxPrice };
    if (query.inStock === 'true') where.stock = { gt: 0 };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, description: true, price: true, stock: true, createdAt: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Decimal -> number
    const mapped = items.map(p => ({ ...p, price: Number(p.price) }));
    return { page, limit, total, items: mapped };
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, price: true, stock: true, createdAt: true },
    });
    return p && { ...p, price: Number(p.price) };
  }
  
   async create(dto: any) {
    const p = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        price: new Prisma.Decimal(dto.price),
        stock: dto.stock,
      },
      select: { id: true, name: true, description: true, price: true, stock: true, createdAt: true },
    });
    return { ...p, price: Number(p.price) };
  }


}
