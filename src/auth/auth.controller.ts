import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { userRegisterDto } from './dtos/register.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from '../shared/guards/local-auth.guard';
import { JwtAuthGuard } from '../shared/guards/jwt.guard';
import { UserDecorator } from '../shared/user.decorator';
import { EncodedUser } from '../shared/interfaces/encodedUser.interface';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async signUp(@Body() registerUserDto: userRegisterDto) {
    const user = await this.usersService.create(registerUserDto);
    return this.authService.generateToken(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.generateToken(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@UserDecorator() user: EncodedUser) {
    return this.usersService.findOne(user.id);
  }
}
