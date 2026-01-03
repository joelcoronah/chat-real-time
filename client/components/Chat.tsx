"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { UsernameModal } from "./UsernameModal";

/**
 * Interface for chat messages.
 * Matches the server-side ChatMessage interface.
 */
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  imageUrl?: string;
  type: "text" | "image" | "system"; // Added system type for join/leave notifications
}

/**
 * Main chat component.
 * Manages WebSocket connection, user authentication, and message handling.
 */
export function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<string>(""); // Ref to track username for event handlers
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Initialize socket connection when component mounts.
   * Sets up event listeners for connection status and messages.
   */
  useEffect(() => {
    // Create socket connection to the NestJS server
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    // Handle connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
      setIsConnected(false);
    });

    // Handle incoming messages
    newSocket.on("message", (message: ChatMessage) => {
      // Convert timestamp string to Date object if needed
      const msg = {
        ...message,
        timestamp: new Date(message.timestamp),
      };
      setMessages((prev) => [...prev, msg]);
    });

    // Handle user join/leave notifications
    newSocket.on("userJoined", (data: { username: string }) => {
      console.log(`👤 User joined: ${data.username}`);
      // Don't show join notification for the current user (they know they joined)
      if (usernameRef.current === data.username) {
        return; // Skip own join notification
      }
      // Create a system message for other users joining
      const systemMessage: ChatMessage = {
        id: `system-join-${Date.now()}-${Math.random()}`,
        username: "System",
        message: `${data.username} joined the chat`,
        timestamp: new Date(),
        type: "system",
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    newSocket.on("userLeft", (data: { username: string }) => {
      console.log(`👋 User left: ${data.username}`);
      // Create a system message for user leave
      const systemMessage: ChatMessage = {
        id: `system-left-${Date.now()}-${Math.random()}`,
        username: "System",
        message: `${data.username} left the chat`,
        timestamp: new Date(),
        type: "system",
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // Handle typing indicators
    newSocket.on("typing", (data: { username: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);

        if (data.isTyping) {
          // Add user to typing set
          newSet.add(data.username);

          // Clear existing timeout for this user
          const existingTimeout = typingTimeoutRef.current.get(data.username);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          // Set timeout to remove typing indicator after 3 seconds of inactivity
          const timeout = setTimeout(() => {
            setTypingUsers((current) => {
              const updated = new Set(current);
              updated.delete(data.username);
              return updated;
            });
            typingTimeoutRef.current.delete(data.username);
          }, 3000);

          typingTimeoutRef.current.set(data.username, timeout);
        } else {
          // Remove user from typing set
          newSet.delete(data.username);

          // Clear timeout if exists
          const existingTimeout = typingTimeoutRef.current.get(data.username);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
            typingTimeoutRef.current.delete(data.username);
          }
        }

        return newSet;
      });
    });

    setSocket(newSocket);

    // Cleanup: disconnect socket when component unmounts
    return () => {
      // Clear all typing timeouts
      const timeouts = typingTimeoutRef.current;
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
      newSocket.close();
    };
  }, []);

  /**
   * Scroll to bottom when new messages arrive.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handle username submission.
   * Joins the chat with the provided username.
   */
  const handleUsernameSubmit = (name: string) => {
    if (name.trim() && socket) {
      const trimmedName = name.trim();
      setUsername(trimmedName);
      usernameRef.current = trimmedName; // Update ref for event handlers
      setShowUsernameModal(false);
      // Emit join event to server
      socket.emit("join", { username: trimmedName });
    }
  };

  /**
   * Handle sending text messages.
   */
  const handleSendMessage = (message: string) => {
    if (message.trim() && socket && username) {
      socket.emit("message", {
        message: message.trim(),
        username,
      });
      // Stop typing indicator when message is sent
      socket.emit("typing", { username, isTyping: false });
    }
  };

  /**
   * Handle sending image messages.
   * Converts the image file to base64 data URL.
   */
  const handleSendImage = (imageFile: File, caption?: string) => {
    if (socket && username) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Emit image message to server
        socket.emit("image", {
          imageUrl,
          username,
          caption,
        });
      };

      reader.readAsDataURL(imageFile);
    }
  };

  /**
   * Handle typing status changes.
   * Emits typing events to the server.
   */
  const handleTyping = (isTyping: boolean) => {
    if (socket && username) {
      socket.emit("typing", { username, isTyping });
    }
  };

  // Show username modal if not connected or username not set
  if (showUsernameModal || !username) {
    return (
      <UsernameModal
        onSubmit={handleUsernameSubmit}
        isOpen={showUsernameModal}
      />
    );
  }

  return (
    <div className="flex h-screen w-full max-w-4xl flex-col bg-white shadow-lg">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-primary-600 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          />
          <h1 className="text-xl font-semibold text-white">Real-Time Chat</h1>
        </div>
        <div className="text-sm text-white/80">{username}</div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 chat-scrollbar">
        <ChatMessages
          messages={messages}
          currentUsername={username}
          typingUsers={Array.from(typingUsers)}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onTyping={handleTyping}
        isConnected={isConnected}
      />
    </div>
  );
}
