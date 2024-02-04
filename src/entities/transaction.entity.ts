import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class ProductTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  buyer: User;

  @ManyToOne(() => Product, product => product.transactions)
  product: Product;

  @Column()
  quantity: number;

  @Column()
  totalCost: number;
}
