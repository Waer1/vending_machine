import { Test, TestingModule } from '@nestjs/testing';
import { VendingController } from './vending.controller';

describe('VendingController', () => {
  let controller: VendingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendingController],
    }).compile();

    controller = module.get<VendingController>(VendingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
