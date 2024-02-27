import { Controller, Post } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  @Post()
  async create() {}
}
