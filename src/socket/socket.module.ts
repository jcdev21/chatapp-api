import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [SocketGateway, MessageService],
  exports: [SocketGateway],
})
export class SocketModule {}
