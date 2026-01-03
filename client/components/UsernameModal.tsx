"use client";

import { useState, FormEvent } from "react";

interface UsernameModalProps {
  onSubmit: (username: string) => void;
  isOpen: boolean;
}

/**
 * Modal component for username input.
 * Shown when user first loads the chat or needs to set their username.
 */
export function UsernameModal({ onSubmit, isOpen }: UsernameModalProps) {
  const [username, setUsername] = useState("");

  /**
   * Handle form submission.
   * Validates username and calls onSubmit callback.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      onSubmit(username.trim());
    } else {
      alert("Username must be at least 2 characters long");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Welcome to Real-Time Chat
        </h2>
        <p className="mb-6 text-gray-600">
          Please enter your username to start chatting
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoFocus
            className="w-full rounded-lg text-gray-600 border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            minLength={2}
            maxLength={20}
          />
          <button
            type="submit"
            disabled={username.trim().length < 2}
            className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
