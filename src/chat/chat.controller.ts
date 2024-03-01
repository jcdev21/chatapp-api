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
import { UserService } from 'src/user/user.service';
import { Chat, User } from '@prisma/client';

type ChatWithUserReturnType = Chat & {
  detailMember: Pick<User, 'id' | 'email' | 'name' | 'image'>;
};

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body(new ZodPipe(createChatSchema)) payload: CreateChatDto) {
    try {
      const chatExist = await this.chatService.findOneByMember(payload.members);
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

  @Get(':userId')
  async getChats(@Param('userId') userId: string) {
    try {
      const chats = await this.chatService.findAllByUserId(userId);
      const idMembers = await this.chatService.getIdUserInclude(userId, chats);
      const users = await this.userService.findAllChatMember(userId, idMembers);
      const groupById = users.reduce<
        Record<string, Pick<User, 'id' | 'email' | 'name' | 'image'>[]>
      >((group, product) => {
        const { id } = product;
        group[id] = group[id] ?? [];
        group[id].push(product);
        return group;
      }, {});
      const result = chats.map<ChatWithUserReturnType>((chat) => {
        const detailMember = groupById[chat.members[0]][0];
        return { ...chat, detailMember };
      });

      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'chats',
        data: result,
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

  @Get(':userId/exclude')
  async getExcludeMembers(@Param('userId') userId: string) {
    try {
      const chats = await this.chatService.findAllByUserId(userId);
      const idMembers = await this.chatService.getIdUserInclude(userId, chats);
      const users = await this.userService.findAllNotChatMember(
        userId,
        idMembers,
      );

      return {
        status: true,
        statusCode: HttpStatus.OK,
        message: 'other members',
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
      );
    }
  }
}
