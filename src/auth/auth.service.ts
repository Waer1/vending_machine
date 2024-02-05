import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: User) {
    console.log('user', user);
    const payload = { id: user.id, username: user.username, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload,
    };
  }
}
