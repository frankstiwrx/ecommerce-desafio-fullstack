import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, MinLength, IsUrl } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Camisa Barcelona 23/24' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Camisa oficial, tecido dry fit', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.example.com/produto.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ example: 299.9 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;
}
