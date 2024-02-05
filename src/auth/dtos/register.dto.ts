import {
  IsNotEmpty,
  IsStrongPassword,
  IsEnum,
  IsString,
} from 'class-validator';
import { UserRole } from '../../shared/userRole';

export class userRegisterDto {
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
