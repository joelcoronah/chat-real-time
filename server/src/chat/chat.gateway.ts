import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Interface for chat messages.
 * Defines the structure of messages sent between clients.
 */
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  imageUrl?: string; // Optional image URL for image messages
  type: 'text' | 'image'; // Message type: text or image
}

/**
 * WebSocket Gateway for real-time chat communication.
 * Handles client connections, disconnections, and message broadcasting.
 */
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Next.js client URL
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Store connected users with their socket IDs
  private connectedUsers: Map<string, string> = new Map();

  /**
   * Handles new client connections.
   * Logs the connection and stores the user's socket ID.
   */
  handleConnection(client: Socket) {
    console.log(`✅ Client connected: ${client.id}`);
  }

  /**
   * Handles client disconnections.
   * Removes the user from the connected users map and notifies other clients.
   */
  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
    
    // Find and remove the disconnected user
    const username = Array.from(this.connectedUsers.entries())
      .find(([_, socketId]) => socketId === client.id)?.[0];
    
    if (username) {
      this.connectedUsers.delete(username);
      // Notify other clients that a user left
      this.server.emit('userLeft', { username });
    }
  }

  /**
   * Handles user joining the chat.
   * Stores the username and socket ID, then notifies all clients.
   */
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username } = data;
    
    // Store the user's socket ID
    this.connectedUsers.set(username, client.id);
    
    // Store username in socket data for later use
    client.data.username = username;
    
    console.log(`👤 User joined: ${username}`);
    
    // Notify all clients that a new user joined
    this.server.emit('userJoined', { username });
    
    // Send list of connected users to the new client
    const users = Array.from(this.connectedUsers.keys());
    client.emit('connectedUsers', { users });
  }

  /**
   * Handles text messages from clients.
   * Broadcasts the message to all connected clients.
   */
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { message: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { message, username } = data;
    
    // Create message object with unique ID and timestamp
    const chatMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      username: username || client.data.username || 'Anonymous',
      message,
      timestamp: new Date(),
      type: 'text',
    };
    
    console.log(`💬 Message from ${chatMessage.username}: ${message}`);
    
    // Broadcast message to all connected clients
    this.server.emit('message', chatMessage);
  }

  /**
   * Handles image messages from clients.
   * Broadcasts the image URL to all connected clients.
   */
  @SubscribeMessage('image')
  handleImage(
    @MessageBody() data: { imageUrl: string; username: string; caption?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { imageUrl, username, caption } = data;
    
    // Create message object for image
    const chatMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      username: username || client.data.username || 'Anonymous',
      message: caption || '📷 Image',
      timestamp: new Date(),
      imageUrl,
      type: 'image',
    };
    
    console.log(`🖼️ Image from ${chatMessage.username}`);
    
    // Broadcast image message to all connected clients
    this.server.emit('message', chatMessage);
  }
}

