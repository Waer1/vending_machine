import { UserRole } from '../shared/userRole';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductTransaction } from './transaction.entity';
import * as bcrypt from 'bcrypt';
import getConfigVariables from '../config/configVariables.config';
import { envConstants } from '../config/constant';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 0 })
  deposit: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => Product, (product) => product.seller)
  productsSold: Product[];

  @OneToMany(() => ProductTransaction, (transaction) => transaction.buyer, {
    cascade: true,
  })
  transactions: ProductTransaction[];

  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = parseInt(
      (await getConfigVariables(envConstants.jwt.bcryptSalt)) || '10',
    );
    const hashed = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hashed;
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
