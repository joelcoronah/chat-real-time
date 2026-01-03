# Chat Server (NestJS)

Real-time chat server built with NestJS and Socket.io.

## Features

- Real-time messaging using WebSockets
- User join/leave notifications
- Text message support
- Image message support
- Connected users list

## Installation

```bash
npm install
```

## Running the server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will run on `http://localhost:3001`

## API Events

### Client → Server

- `join` - Join the chat with a username
- `message` - Send a text message
- `image` - Send an image message

### Server → Client

- `userJoined` - Notification when a user joins
- `userLeft` - Notification when a user leaves
- `message` - New message received
- `connectedUsers` - List of connected users

