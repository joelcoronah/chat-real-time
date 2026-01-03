# Real-Time Chat Application

A simple real-time chat application with NestJS backend and Next.js frontend, similar to Facebook/Instagram chat.

## Features

- ✅ Real-time messaging using WebSockets (Socket.io)
- ✅ User join/leave notifications
- ✅ Text message support
- ✅ Image/screenshot upload and sharing
- ✅ Modern, responsive UI
- ✅ Connection status indicator
- ✅ Username-based authentication

## Project Structure

```
chat-real-time/
├── server/          # NestJS backend
│   ├── src/
│   │   ├── chat/   # Chat gateway and WebSocket handlers
│   │   └── main.ts # Application entry point
│   └── package.json
│
└── client/          # Next.js frontend
    ├── app/         # Next.js app directory
    ├── components/  # React components
    └── package.json
```

## Deployment

For free deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install server dependencies:**

```bash
cd server
npm install
```

2. **Install client dependencies:**

```bash
cd client
npm install
```

### Running the Application

1. **Start the NestJS server:**

```bash
cd server
npm run start:dev
```

The server will run on `http://localhost:3001`

2. **Start the Next.js client (in a new terminal):**

```bash
cd client
npm run dev
```

The client will run on `http://localhost:3000`

3. **Open your browser:**

Navigate to `http://localhost:3000` and enter a username to start chatting!

## How to Use

1. **Enter Username**: When you first open the app, you'll be prompted to enter a username
2. **Send Messages**: Type your message and press Enter to send (Shift+Enter for new line)
3. **Share Images**: Click the image icon to upload and share images or screenshots
4. **Real-time Updates**: Messages and images appear instantly for all connected users

## Technology Stack

### Backend (Server)

- **NestJS** - Progressive Node.js framework
- **Socket.io** - Real-time bidirectional event-based communication
- **TypeScript** - Type-safe JavaScript

### Frontend (Client)

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Socket.io Client** - WebSocket client
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

## API Events

### Client → Server Events

- `join` - Join the chat with a username

  ```typescript
  socket.emit("join", { username: "John" });
  ```

- `message` - Send a text message

  ```typescript
  socket.emit("message", { message: "Hello!", username: "John" });
  ```

- `image` - Send an image message
  ```typescript
  socket.emit("image", {
    imageUrl: "data:image/...",
    username: "John",
    caption: "Optional caption",
  });
  ```

### Server → Client Events

- `userJoined` - Notification when a user joins
- `userLeft` - Notification when a user leaves
- `message` - New message received (text or image)
- `connectedUsers` - List of currently connected users

## Development

### Server Development

```bash
cd server
npm run start:dev  # Watch mode
npm run build      # Build for production
npm run start:prod # Run production build
```

### Client Development

```bash
cd client
npm run dev        # Development server
npm run build      # Build for production
npm run start      # Run production server
```

## Customization

### Change Server Port

Edit `server/src/main.ts`:

```typescript
await app.listen(3001); // Change to your desired port
```

### Change Client Port

Edit `client/package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3000" // Change port here
  }
}
```

### Update CORS Settings

Edit `server/src/main.ts` and `server/src/chat/chat.gateway.ts` to update CORS origins.

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
