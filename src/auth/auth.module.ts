import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.staratgy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import getConfigVariables from '../config/configVariables.config';
import { envConstants } from '../config/constant';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: await getConfigVariables(envConstants.jwt.secret),
        signOptions: {
          expiresIn: await getConfigVariables(envConstants.jwt.expiration),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
