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

  async findAllById(id: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        members: {
          has: id,
        },
      },
    });
  }
}
