import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly userService: UsersService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number, populateSeller: boolean = false): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { seller: populateSeller },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findBySellerId(sellerId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        seller: {
          id: sellerId,
        },
      },
    });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const user = await this.userService.findOne(createProductDto.sellerId);
    const product = this.productRepository.create({
      seller: user,
      ...createProductDto,
    });
    return this.productRepository.save(product);
  }

  async update(
    userId: number,
    ProductId: number,
    updatedFileds: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.findOne(ProductId, true);

    if (updatedProduct.seller.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this product',
      );
    }

    Object.assign(updatedProduct, updatedFileds);
    return this.productRepository.save(updatedProduct);
  }

  async updateProduct(
    productId: number,
    updatedFields: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(productId);

    Object.assign(product, updatedFields);
    return this.productRepository.save(product);
  }

  async remove(userId: number, productId: number): Promise<void> {
    const product = await this.findOne(productId, true);

    if (product.seller.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }

    await this.productRepository.delete(product);
  }
}
