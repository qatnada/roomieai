// app/chat/page.js - Full-page Chat
'use client'
import AgentChat from '@/components/AgentChat'

export default function ChatPage() {
  const householdId = process.env.NEXT_PUBLIC_DEMO_HOUSEHOLD_ID

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Chat with RoomieAI</h1>
        <p className="text-text-3">
          Ask me about expenses, chores, maintenance, or anything else about your shared living space.
        </p>
      </div>

      <AgentChat householdId={householdId} className="h-[calc(100%-80px)]" />
    </div>
  )
}