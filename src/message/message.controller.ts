import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ZodPipe } from 'src/utils/pipes/zod.pipe';
import {
  CreateMessageDto,
  createMessageSchema,
} from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  async create(
    @Body(new ZodPipe(createMessageSchema)) payload: CreateMessageDto,
  ) {
    try {
      const message = await this.messageService.create(payload);
      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'create message successfull',
        data: message,
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

  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string) {
    try {
      const messages = await this.messageService.findAllByChatId(chatId);
      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'messages',
        data: messages,
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
