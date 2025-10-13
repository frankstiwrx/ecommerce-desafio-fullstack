import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'PIX', description: 'Forma de pagamento' })
  @IsOptional()
  @IsString()
  @IsIn(['PIX', 'CREDIT_CARD', 'BOLETO'])
  paymentMethod?: string;

  @ApiPropertyOptional({
    example: 'Rua Exemplo, 123 - Bairro, Cidade/UF',
    description: 'Endereço de entrega (opcional)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  shippingAddr?: string;
}
