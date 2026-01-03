"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (imageFile: File, caption?: string) => void;
  onTyping: (isTyping: boolean) => void;
  isConnected: boolean;
}

/**
 * Chat input component.
 * Handles text input and image file uploads.
 */
export function ChatInput({
  onSendMessage,
  onSendImage,
  onTyping,
  isConnected,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingEmitRef = useRef<boolean>(false);

  /**
   * Emit typing status to server.
   * Uses debouncing to avoid too many events.
   */
  const emitTyping = (isTyping: boolean) => {
    // Only emit if status changed
    if (lastTypingEmitRef.current === isTyping) {
      return;
    }

    lastTypingEmitRef.current = isTyping;
    onTyping(isTyping);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If user stopped typing, clear the timeout
    if (!isTyping) {
      typingTimeoutRef.current = null;
      return;
    }

    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      lastTypingEmitRef.current = false;
      onTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  /**
   * Cleanup timeout on unmount.
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handle input change.
   * Emits typing status when user types.
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Emit typing status
    if (value.trim().length > 0) {
      emitTyping(true);
    } else {
      emitTyping(false);
    }
  };

  /**
   * Handle form submission.
   * Sends the message and clears the input.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage(message);
      setMessage("");
      // Stop typing indicator when message is sent
      emitTyping(false);
    }
  };

  /**
   * Handle Enter key press.
   * Sends message on Enter, new line on Shift+Enter.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /**
   * Handle image file selection.
   * Reads the file and sends it as an image message.
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isConnected) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Send image with optional caption
      const caption = prompt("Add a caption (optional):");
      onSendImage(file, caption || undefined);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Trigger file input click.
   */
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Hidden file input for images */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Image upload button */}
        <button
          type="button"
          onClick={handleImageButtonClick}
          disabled={!isConnected}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Upload image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </button>

        {/* Message textarea */}
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isConnected
              ? "Type a message... (Enter to send, Shift+Enter for new line)"
              : "Connecting..."
          }
          disabled={!isConnected}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || !isConnected}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
