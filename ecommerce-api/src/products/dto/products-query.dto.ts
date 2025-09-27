import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductsQueryDto {
  @ApiPropertyOptional({ description: 'Search term (name contains)', example: 'camisa' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Minimum price', example: 50 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Only items with stock > 0', example: true })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true' || value === 1 || value === '1')
  inStock?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, description: 'Max 50' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    const n = value !== undefined ? Number(value) : undefined;
    return n && n > 50 ? 50 : n;
  })
  limit?: number;
}
