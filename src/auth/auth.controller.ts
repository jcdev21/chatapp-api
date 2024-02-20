import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorators/public.decorator';
import { ZodPipe } from 'src/utils/pipes/zod.pipe';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodPipe(createUserSchema.pick({ email: true, password: true })))
    payload: Pick<CreateUserDto, 'email' | 'password'>,
  ) {
    console.log('Controller', payload);
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
