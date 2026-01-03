'use client'

import { Chat } from '@/components/Chat'

/**
 * Home page component.
 * Renders the main chat interface.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Chat />
    </main>
  )
}

