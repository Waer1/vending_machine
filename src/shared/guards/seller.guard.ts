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
export class SellerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: EncodedUser = request.user;

    console.log('seller guard ' ,user);

    if (user && user.role === UserRole.SELLER) {
      return true;
    }

    throw new UnauthorizedException('Unauthorized Access');
  }
}
