import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: Pick<CreateUserDto, 'email' | 'password'>) {
    try {
      const data = await this.authService.login(
        payload.email,
        payload.password,
      );
      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'login successfull',
        data,
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
  async register(@Body() payload: CreateUserDto) {
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
