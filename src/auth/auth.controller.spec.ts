import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { UserRole } from '../shared/userRole';
import { UsersService } from '../users/users.service';
import { userRegisterDto } from './dtos/register.dto';
import { BadRequestException } from '@nestjs/common';

describe('Auth Controller', () => {
  let controller: AuthController;
  let FakeAuthService: Partial<AuthService>;
  let FakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    FakeAuthService = {
      generateToken: (_user: User) =>
        Promise.resolve({
          token: 'fake_token',
          user: {
            id: _user.id,
            username: _user.username,
            role: _user.role,
          },
        }),
    };

    const user: User[] = [];
    FakeUserService = {
      create: (_user: User) => {
        const userExist = user.filter(
          (user) => user.username === _user.username,
        );

        if (userExist.length > 0) {
          return Promise.reject(
            new BadRequestException('username already exists'),
          );
        }

        user.push(_user);
        _user.id = user.length;
        return Promise.resolve(_user);
      },
      findOne: (_id: number) => {
        const filterdUser = user.filter((user) => user.id === _id);
        return Promise.resolve(filterdUser[0]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: FakeAuthService,
        },
        {
          provide: UsersService,
          useValue: FakeUserService,
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate a token for a user', async () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      role: UserRole.SELLER,
    } as User;

    const token = await controller.signUp(user);

    expect(token).toEqual({
      token: 'fake_token',
      user: { id: 1, username: 'testuser', role: UserRole.SELLER },
    });
  });

  it('should create a user and return a token', async () => {
    const registeruserDTO: userRegisterDto = {
      username: 'testuser',
      password: 'password',
      role: UserRole.SELLER,
    };

    const returnedUser = await controller.signUp(registeruserDTO);

    expect(returnedUser).toEqual({
      token: 'fake_token',
      user: { id: 1, username: 'testuser', role: 'seller' },
    });
  });

  it('should fail when create user with the same username', async () => {
    const registeruserDTO: userRegisterDto = {
      username: 'testuser',
      password: 'password',
      role: UserRole.SELLER,
    };

    await controller.signUp(registeruserDTO);

    await expect(controller.signUp(registeruserDTO)).rejects.toThrow(
      'username already exists',
    );
  });
});
