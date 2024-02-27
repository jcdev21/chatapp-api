import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ZodPipe } from 'src/utils/pipes/zod.pipe';
import { CreateChatDto, createChatSchema } from './dto/create-chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async create(@Body(new ZodPipe(createChatSchema)) payload: CreateChatDto) {
    try {
      const chatExist = await this.chatService.findExisted(payload.members);
      if (chatExist) {
        return {
          status: true,
          statusCode: HttpStatus.CREATED,
          message: 'chat has already been done',
          data: chatExist,
        };
      }

      const chat = await this.chatService.create(payload);
      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'create chat successfull',
        data: chat,
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

  @Get(':id')
  async getChats(@Param('id') id: string) {
    try {
      const chats = await this.chatService.findAllById(id);
      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'chats',
        data: chats,
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
