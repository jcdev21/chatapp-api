import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, AuthModule, GlobalModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
