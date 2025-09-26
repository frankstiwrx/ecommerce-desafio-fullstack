import { Controller, Get, Post, Patch, Delete, UseGuards, Request, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddItemDto } from './dto/add-item.dto';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  add(@Request() req: any, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  update(@Request() req: any, @Param('id') itemId: string, @Body() body: { qty: number }) {
    return this.cartService.updateItem(req.user.userId, itemId, body.qty);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req: any, @Param('id') itemId: string) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }
}
