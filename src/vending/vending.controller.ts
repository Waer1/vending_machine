import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { VendingService } from './vending.service';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { BuyerGuard } from '../shared/guards/buyer.guard';
import { UserDecorator } from '../shared/user.decorator';
import { EncodedUser } from '../shared/interfaces/encodedUser.interface';
import { BuyProductDto } from './dtos/buy-product.dto';

@Controller('vending')
export class VendingController {
  constructor(private readonly vendingService: VendingService) {}

  @UseGuards(JwtAuthGuard, BuyerGuard)
  @Post('deposit')
  deposit(
    @UserDecorator() user: EncodedUser,
    @Body('amount') amount: number,
  ): Promise<object> {
    return this.vendingService.deposit(user, amount);
  }

  @UseGuards(JwtAuthGuard, BuyerGuard)
  @Post('buy')
  buy(
    @UserDecorator() user: EncodedUser,
    @Body() buyProductDto: BuyProductDto,
  ): Promise<any> {
    return this.vendingService.buy(user, buyProductDto);
  }

  @UseGuards(JwtAuthGuard, BuyerGuard)
  @Post('reset')
  reset(@UserDecorator() user: EncodedUser): Promise<void> {
    return this.vendingService.reset(user);
  }
}
