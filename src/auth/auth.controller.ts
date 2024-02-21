import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { ZodPipe } from 'src/utils/pipes/zod.pipe';
import { ACCESS_AND_REFRESH_TOKEN } from 'src/types/token';
import { Response } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodPipe(createUserSchema.pick({ email: true, password: true })))
    payload: Pick<CreateUserDto, 'email' | 'password'>,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const data = await this.authService.verifyUser(
        payload.email,
        payload.password,
      );
      const { accessToken, refreshToken } = (await this.authService.createToken(
        data,
      )) as ACCESS_AND_REFRESH_TOKEN;

      const expCookie = new Date(Date.now() + 60 * 60 * 1000 * 5); // 5 Jam
      res.cookie('refresh-token', refreshToken, {
        expires: expCookie,
        httpOnly: true,
        sameSite: 'strict',
      });

      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'login successfull',
        data: { ...data, accessToken },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('register')
  async register(@Body(new ZodPipe(createUserSchema)) payload: CreateUserDto) {
    try {
      const user = await this.authService.register(payload);
      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'register successfull',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
