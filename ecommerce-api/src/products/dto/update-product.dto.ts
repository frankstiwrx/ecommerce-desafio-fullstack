import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({ example: 'Camisa Barcelona 23/24' })
  name?: string;

  @ApiPropertyOptional({ example: 'Camisa oficial, tecido dry fit' })
  description?: string;

  @ApiPropertyOptional({ example: 299.9 })
  price?: number;

  @ApiPropertyOptional({ example: 50 })
  stock?: number;
}
