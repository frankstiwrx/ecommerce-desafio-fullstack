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
import { AddItemDto } from './dto/add-item.dto';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOkResponse({ description: 'Get (or create) the current user cart' })
  me(@Request() req: any) {
    return this.cartService.getOrCreateCart(req.user.sub);
  }

  @Post('items')
  @ApiBody({ type: AddItemDto })
  @ApiOkResponse({ description: 'Add an item to cart and return updated cart' })
  add(@Request() req: any, @Body() dto: AddItemDto) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Patch('items/:id')
  @ApiParam({ name: 'id', description: 'Cart item ID (UUID)' })
  @ApiBody({ type: UpdateItemDto })
  @ApiOkResponse({ description: 'Update item quantity and return updated cart' })
  update(@Request() req: any, @Param('id') itemId: string, @Body() body: UpdateItemDto) {
    return this.cartService.updateItem(req.user.sub, itemId, body.qty);
  }

  @Delete('items/:id')
  @ApiParam({ name: 'id', description: 'Cart item ID (UUID)' })
  @ApiOkResponse({ description: 'Remove an item and return updated cart' })
  remove(@Request() req: any, @Param('id') itemId: string) {
    return this.cartService.removeItem(req.user.sub, itemId);
  }
}
