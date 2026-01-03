"use client";

import Image from "next/image";

/**
 * Interface for chat messages.
 */
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  imageUrl?: string;
  type: "text" | "image" | "system"; // Added system type for join/leave notifications
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUsername: string;
  typingUsers: string[]; // Array of usernames who are currently typing
}

/**
 * Component to display chat messages.
 * Shows text and image messages with timestamps.
 */
export function ChatMessages({
  messages,
  currentUsername,
  typingUsers,
}: ChatMessagesProps) {
  /**
   * Format timestamp to readable time string.
   */
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Format typing indicator message.
   * Handles single or multiple users typing.
   */
  const getTypingMessage = () => {
    if (typingUsers.length === 0) return null;

    if (typingUsers.length === 1) {
      return `${typingUsers[0]} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
    } else {
      return `${typingUsers[0]} and ${
        typingUsers.length - 1
      } others are typing...`;
    }
  };

  const typingMessage = getTypingMessage();

  if (messages.length === 0 && !typingMessage) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        // Handle system messages (join/leave notifications)
        if (message.type === "system") {
          return (
            <div key={message.id} className="flex justify-center">
              <div className="rounded-full bg-gray-100 px-4 py-1.5">
                <p className="text-xs text-gray-500">{message.message}</p>
              </div>
            </div>
          );
        }

        const isOwnMessage = message.username === currentUsername;

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] flex-col ${
                isOwnMessage ? "items-end" : "items-start"
              }`}
            >
              {/* Username label (only for other users' messages) */}
              {!isOwnMessage && (
                <span className="mb-1 text-xs font-semibold text-gray-600">
                  {message.username}
                </span>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isOwnMessage
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {/* Image message */}
                {message.type === "image" && message.imageUrl && (
                  <div className="mb-2">
                    <Image
                      src={message.imageUrl}
                      alt={message.message || "Shared image"}
                      width={300}
                      height={300}
                      className="max-h-64 rounded-lg object-contain"
                      unoptimized
                    />
                    {message.message && message.message !== "📷 Image" && (
                      <p className="mt-2 text-sm">{message.message}</p>
                    )}
                  </div>
                )}

                {/* Text message */}
                {message.type === "text" && (
                  <p className="whitespace-pre-wrap break-words">
                    {message.message}
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <span className="mt-1 text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingMessage && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-gray-200 px-4 py-2">
            <p className="text-sm italic text-gray-600">{typingMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
