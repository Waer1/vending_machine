import { Module } from '@nestjs/common';
import { VendingController } from './vending.controller';
import { VendingService } from './vending.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTransaction } from '../entities/transaction.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTransaction]),
    UsersModule,
    ProductsModule,
  ],
  controllers: [VendingController],
  providers: [VendingService],
})
export class VendingModule {}
