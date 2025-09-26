import { Controller, Get, Param, Query, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
create(@Body() dto: CreateProductDto) {
  return this.productsService.create(dto);
}

@Patch(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  return this.productsService.update(id, dto);
}

@Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
remove(@Param('id') id: string) {
  return this.productsService.remove(id);
}


}
