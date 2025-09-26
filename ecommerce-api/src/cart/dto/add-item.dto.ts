import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsPositive()
  qty: number;
}
