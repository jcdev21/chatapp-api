import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMessageDto) {
    return await this.prisma.message.create({ data: dto });
  }

  async findAllByChatId(chatId: string) {
    return await this.prisma.message.findMany({ where: { chatId } });
  }
}
