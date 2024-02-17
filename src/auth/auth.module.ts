import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    {
      // membuat guard menjadi global
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    UserService,
    JwtService,
  ],
})
export class AuthModule {}
