import { UserRole } from 'src/shared/userRole';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { ProductTransaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  deposit: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => Product, (product) => product.seller)
  productsSold: Product[];

  @OneToMany(() => ProductTransaction, transaction => transaction.buyer, { cascade: true })
  transactions: ProductTransaction[];
}
