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

  /**
   * Retrieves all products.
   *
   * @return {Promise<Product[]>} A promise that resolves to an array of all products.
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {number} id The ID of the product to retrieve.
   * @param {boolean} populateSeller Whether to populate the seller of the product.
   *
   * @throws {NotFoundException} If no product with the given ID exists.
   * @return {Promise<Product>} A promise that resolves to the product with the given ID.
   */
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

  /**
   * Retrieves all products by a seller's ID.
   *
   * @param {number} sellerId The ID of the seller whose products to retrieve.
   *
   * @return {Promise<Product[]>} A promise that resolves to an array of the seller's products.
   */
  async findBySellerId(sellerId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        seller: {
          id: sellerId,
        },
      },
    });
  }

  /**
   * Creates a new product.
   *
   * @param {CreateProductDto} createProductDto The details of the product to create.
   *
   * @return {Promise<Product>} A promise that resolves to the newly created product.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const user = await this.userService.findOne(createProductDto.sellerId);
    const product = this.productRepository.create({
      seller: user,
      ...createProductDto,
    });
    return this.productRepository.save(product);
  }

  /**
   * Updates a product.
   *
   * @param {number} userId The ID of the user making the request.
   * @param {number} ProductId The ID of the product to update.
   * @param {UpdateProductDto} updatedFileds The new details of the product.
   *
   * @throws {UnauthorizedException} If the user is not authorized to update the product.
   * @return {Promise<Product>} A promise that resolves to the updated product.
   */
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

  /**
   * Updates a product.
   *
   * @param {number} productId The ID of the product to update.
   * @param {UpdateProductDto} updatedFields The new details of the product.
   *
   * @return {Promise<Product>} A promise that resolves to the updated product.
   */
  async updateProduct(
    productId: number,
    updatedFields: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(productId);

    Object.assign(product, updatedFields);
    return this.productRepository.save(product);
  }

  /**
   * Deletes a product.
   *
   * @param {number} userId The ID of the user making the request.
   * @param {number} productId The ID of the product to delete.
   *
   * @throws {UnauthorizedException} If the user is not authorized to delete the product.
   * @return {Promise<void>} A promise that resolves when the product has been deleted.
   */
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
