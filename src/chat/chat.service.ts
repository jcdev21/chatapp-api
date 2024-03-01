import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateChatDto): Promise<Chat> {
    return this.prisma.chat.create({
      data: { members: dto.members },
    });
  }

  async findOneByMember(members: string[]): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        members: {
          hasEvery: members,
        },
      },
    });
  }

  async findAllByUserId(id: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        members: {
          has: id,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getIdUserInclude(userId: string, chats: Chat[]): Promise<string[]> {
    return chats.map((chat) => {
      const idxSameUserId = chat.members.indexOf(userId);
      chat.members.splice(idxSameUserId, 1)[0];
      return chat.members[0];

      // jika tidak ingin terjadi mutate di chats dan chats di controller
      // if (idxSameUserId === 1) {
      //   return chat.members[0];
      // }
      // return chat.members[1];
    });
  }
}
