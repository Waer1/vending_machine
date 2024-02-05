import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsNumber()
  amountAvailable: number;

  @IsNumber()
  cost: number;

  
  sellerId?: number;
}
