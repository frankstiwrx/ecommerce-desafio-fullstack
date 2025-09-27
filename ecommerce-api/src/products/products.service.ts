import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MESSAGES } from '../common/messages';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly cacheTtl: number;

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {
    this.cacheTtl = Number(this.config.get('CACHE_TTL')) || 60;
  }

  private cacheKeyForList(query: any) {
    const norm = {
      q: query.q ?? undefined,
      minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
      inStock: query.inStock === 'true' ? true : query.inStock === 'false' ? false : undefined,
      page: Number(query.page ?? 1),
      limit: Number(query.limit ?? 10),
    };
    return `products:list:${JSON.stringify(norm)}`;
  }

  private async invalidateProductsCache() {
    if ((this.cache as any).store?.reset) {
      await (this.cache as any).store.reset();
    }
  }

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

    const key = this.cacheKeyForList(query);
    const cached = await this.cache.get<{
      page: number;
      limit: number;
      total: number;
      items: any[];
    }>(key);
    if (cached) return cached;

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
    const result = { page, limit, total, items: mapped };

    await this.cache.set(key, result, this.cacheTtl);
    return result;
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

    await this.invalidateProductsCache();
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

      await this.invalidateProductsCache();
      return { ...p, price: Number(p.price) };
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException(MESSAGES.product.notFound);
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.delete({ where: { id } });
      await this.invalidateProductsCache();
      return { ok: true };
    } catch (e: any) {
      if (e?.code === 'P2025') throw new NotFoundException(MESSAGES.product.notFound);
      throw e;
    }
  }
}
