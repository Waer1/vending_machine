import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { SellerGuard } from '../shared/guards/seller.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UserDecorator } from '../shared/user.decorator';
import { EncodedUser } from '../shared/interfaces/encodedUser.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  // no auth
  @Get()
  getAll() {
    return this.productService.findAll();
  }

  // Seller
  @UseGuards(JwtAuthGuard, SellerGuard)
  @Get('my-products')
  getMyProducts(@UserDecorator() user: EncodedUser) {
    const { id } = user;
    console.log(user);
    return this.productService.findBySellerId(id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Post()
  addProduct(
    @UserDecorator() user: EncodedUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    const { id } = user;
    createProductDto.sellerId = id;
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  updateProduct(
    @UserDecorator() user: EncodedUser,
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const { id } = user;
    return this.productService.update(+id, productId, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SellerGuard)
  deleteProduct(
    @UserDecorator() user: EncodedUser,
    @Param('id', ParseIntPipe) productId: number,
  ) {
    const { id } = user;
    return this.productService.remove(id, productId);
  }
}
