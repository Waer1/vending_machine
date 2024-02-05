import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProductTransaction } from './transaction.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amountAvailable: number;

  @Column()
  cost: number;

  @Column()
  productName: string;

  @ManyToOne(() => User, (user) => user.productsSold, { cascade: true })
  seller: User;

  @OneToMany(() => ProductTransaction, (transaction) => transaction.product, {
    cascade: true,
  })
  transactions: ProductTransaction[];
}
