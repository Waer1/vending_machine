import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({ usernameField: 'username' });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.validateUser(username, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
