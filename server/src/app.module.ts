import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';

/**
 * Main application module.
 * Registers the ChatGateway for real-time communication.
 */
@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
