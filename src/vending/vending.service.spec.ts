import { Test, TestingModule } from '@nestjs/testing';
import { VendingService } from './vending.service';

describe('VendingService', () => {
  let service: VendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendingService],
    }).compile();

    service = module.get<VendingService>(VendingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
