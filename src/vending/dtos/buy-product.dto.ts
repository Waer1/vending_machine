import { IsNumber, IsPositive } from 'class-validator';

export class BuyProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @IsPositive()
  amount: number;
}
