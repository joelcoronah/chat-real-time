import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to start the NestJS application.
 * Configures CORS for WebSocket connections and starts the server on port 3001.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for WebSocket connections
  // This allows the Next.js client to connect to the server
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js default port
    credentials: true,
  });

  // Start the server on port 3001
  await app.listen(3001);
  console.log('🚀 Chat server is running on http://localhost:3001');
}

bootstrap();

