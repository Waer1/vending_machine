import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Generates a JWT token for a user.
   *
   * @param {User} user The user for whom to generate the token.
   *
   * @return {Promise<{ token: string; user: { id: number; username: string; role: UserRole; }; }>} A promise that resolves to an object containing the token and the user's details.
   */
  async generateToken(user: User) {
    const payload = { id: user.id, username: user.username, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload,
    };
  }
}
