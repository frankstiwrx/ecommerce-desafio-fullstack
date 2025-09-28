import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  me(@Request() req: any) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  @Post('items')
  add(@Request() req: any, @Body() dto: { productId: string; qty: number }) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Patch('items/:id')
  update(@Request() req: any, @Param('id') itemId: string, @Body() body: { qty: number }) {
    return this.cartService.updateItem(req.user.userId, itemId, body.qty);
  }

  @Delete('items/:id')
  remove(@Request() req: any, @Param('id') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }
}
