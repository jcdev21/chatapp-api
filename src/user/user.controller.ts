import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Header,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { ZodPipe } from 'src/utils/pipes/zod.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ZodPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    try {
      throw new Error('Ada Error');
      return await this.userService.create(createUserDto);
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

  @Get()
  @Header('Cache-Control', 'none')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return {
        success: true,
        status: HttpStatus.OK,
        message: 'success get users',
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      return {
        success: true,
        status: HttpStatus.OK,
        message: 'success get user',
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
        {
          cause: error,
        },
      );
    }
  }
}
