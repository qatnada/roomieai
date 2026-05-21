// components/AgentChat.js
/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import AgentSteps from './AgentSteps'

const SUGGESTED_PROMPTS = [
  "What does everyone owe this month?",
  "The sink is clogged again",
  "Who has not paid rent yet?",
  "Give me a household summary",
  "The AC is leaking again and the WiFi bill still has not been paid"
]

export default function AgentChat({ householdId, className = "" }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          householdId: householdId || process.env.NEXT_PUBLIC_DEMO_HOUSEHOLD_ID
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Agent request failed')
      }

      const agentMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.text || 'No response text',
        steps: data.steps || [],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, agentMessage])

    } catch (error) {
      console.error('Agent error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt)
    sendMessage(prompt)
  }

  return (
    <div className={`bg-surface-1 border border-white/10 rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <span className="text-accent font-bold">AI</span>
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">RoomieAI Assistant</h3>
            <p className="text-text-3 text-sm">
              {isLoading ? 'Thinking...' : 'Ready to help with your shared living needs'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px] max-h-[500px]">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-text-3 mb-4">Ask me anything about your household!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left p-3 bg-surface-2 hover:bg-surface-3 rounded-lg text-sm text-text-2 transition-colors duration-200 border border-white/5"
                >
                  "                  {prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-accent text-white'
                  : message.error
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-surface-2 text-text-1'
              }`}
            >
              {message.role === 'assistant' && message.steps && (
                <AgentSteps steps={message.steps} />
              )}
              <p className={message.steps ? 'mt-3' : ''}>{message.content}</p>
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-surface-2 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-text-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>RoomieAI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about expenses, chores, maintenance, or anything else..."
            className="flex-1 input-field"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}