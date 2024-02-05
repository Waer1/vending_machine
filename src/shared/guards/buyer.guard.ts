import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EncodedUser } from '../interfaces/encodedUser.interface';
import { UserRole } from '../userRole';

@Injectable()
export class BuyerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: EncodedUser = request.user;
    console.log('buyer guard', user);

    if (user && user.role === UserRole.BUYER) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized Access');
  }
}
