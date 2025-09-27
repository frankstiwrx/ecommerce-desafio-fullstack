import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ example: 5, description: 'New quantity for the cart item' })
  @IsInt()
  @Min(1)
  qty: number;
}
