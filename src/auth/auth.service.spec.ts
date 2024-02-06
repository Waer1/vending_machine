import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../shared/userRole';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a token for a user', async () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      role: UserRole.SELLER,
    } as User;

    const token = await service.generateToken(user);

    console.log(token);

    expect(token).toEqual({
      token: 'fake_token',
      user: { id: 1, username: 'testuser', role: UserRole.SELLER},
    });

    // Verify that jwtService.sign was called with the correct payload
    expect(jwtService.sign).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser',
      role: UserRole.SELLER,
    });
  });
});
