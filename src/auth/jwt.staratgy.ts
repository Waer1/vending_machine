import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import getConfigVariables from '../config/configVariables.config';
import { envConstants } from '../config/constant';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getConfigVariables(envConstants.jwt.secret),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
