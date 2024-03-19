import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.info(`socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.info(`socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ): string {
    console.log('trigger from client', message);

    client.emit('chat', message);
    return 'Hello world!';
  }
}
