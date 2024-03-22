import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.info(`socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.info(`socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: string,
  ): void {
    console.log('JOIN CHAT', chatId);
    client.join(chatId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ): Promise<void> {
    // console.log(client.handshake.headers.cookie);
    // console.log('trigger from client', payload);
    const message = await this.messageService.create({
      chatId: payload.chatId,
      senderId: payload.senderId,
      message: payload.message,
    });

    // to all
    // this.server.sockets.emit('receiveMessage', message);

    // to all connected clients except the sender
    // this.server.emit('receiveMessage', message);

    // to specific client
    this.server.to(payload.chatId).emit('receiveMessage', message);

    // only to sender
    // client.emit('receiveMessage', message);
  }
}
