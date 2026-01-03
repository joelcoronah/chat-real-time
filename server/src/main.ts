import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function to start the NestJS application.
 * Configures CORS for WebSocket connections and starts the server on port 3001.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get port from environment variable or default to 3001
  const port = process.env.PORT || 3001;

  // Get allowed origins from environment variable or default to localhost
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

  // Enable CORS for WebSocket connections
  // This allows the Next.js client to connect to the server
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Start the server
  await app.listen(port);
  console.log(`🚀 Chat server is running on port ${port}`);
}

bootstrap();
