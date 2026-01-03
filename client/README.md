# Chat Client (Next.js)

Real-time chat client built with Next.js, React, and Socket.io.

## Features

- Real-time messaging
- Image upload and sharing
- User authentication (username)
- Modern, responsive UI
- Connection status indicator

## Installation

```bash
npm install
```

## Running the client

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start
```

The client will run on `http://localhost:3000`

## Usage

1. Enter your username when prompted
2. Start chatting with other connected users
3. Click the image icon to upload and share images
4. Press Enter to send messages, Shift+Enter for new lines

## Components

- **Chat** - Main chat component managing WebSocket connection
- **ChatMessages** - Displays message list
- **ChatInput** - Text input and image upload
- **UsernameModal** - Username entry modal

