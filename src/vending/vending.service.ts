// vending.service.ts
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTransaction } from '../entities/transaction.entity';
import { ProductsService } from '../products/products.service';
import { EncodedUser } from '../shared/interfaces/encodedUser.interface';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { BuyProductDto } from './dtos/buy-product.dto';

@Injectable()
export class VendingService {
  constructor(
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
    @InjectRepository(ProductTransaction)
    private readonly transactionService: Repository<ProductTransaction>,
  ) {}

  private readonly acceptedCoins = [5, 10, 20, 50, 100];

  private isValidCoin(coin: number): boolean {
    return this.acceptedCoins.includes(coin);
  }

  async deposit(_user: EncodedUser, amount: number): Promise<object> {
    if (!this.isValidCoin(amount)) {
      throw new NotFoundException(
        `Invalid coin denomination we only accept one of the following ${this.acceptedCoins.join(', ')}`,
      );
    }

    const user = await this.userService.findOne(_user.id);

    user.deposit += amount;
    await this.userService.update(user.id, user);
    return {
      message: `Deposit successful and your current balance is ${user.deposit}  cents.`,
    };
  }

  async buy(_user: EncodedUser, buyProductDto: BuyProductDto): Promise<any> {
    const { productId, amount } = buyProductDto;
    const product = await this.productService.findOne(productId, true);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.amountAvailable < amount) {
      throw new NotFoundException('Insufficient quantity available');
    }

    const totalCost = product.cost * amount;

    const buyerUser = await this.userService.findOne(_user.id);

    if (buyerUser.deposit < totalCost) {
      throw new NotAcceptableException('Insufficient funds');
    }

    buyerUser.deposit -= totalCost;
    await this.userService.update(buyerUser.id, buyerUser);

    product.amountAvailable -= amount;
    await this.productService.updateProduct(productId, product);

    const seller = product.seller;
    if (seller) {
      seller.deposit += totalCost;
      await this.userService.update(seller.id, seller);
    }

    const transaction = await this.transactionService.save({
      buyer: buyerUser,
      product,
      quantity: amount,
      totalCost,
    });

    return {
      totalSpent: totalCost,
      productsPurchased: transaction,
      change: buyerUser.deposit,
    };
  }

  async reset(_user: EncodedUser): Promise<void> {
    const user = await this.userService.findOne(_user.id);
    user.deposit = 0;
    await this.userService.update(user.id, user);
  }
}
