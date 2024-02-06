import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { UsersService } from '../users/users.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let FakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: UsersService,
          useValue: FakeUserService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
