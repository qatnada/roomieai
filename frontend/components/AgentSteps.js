// components/AgentSteps.js
'use client'
import { useState, useEffect } from 'react'
import { Database, FileText, Mail, Calculator } from 'lucide-react'

const getStepIcon = (toolName) => {
  if (toolName?.includes('find') || toolName?.includes('search')) return Database
  if (toolName?.includes('insert') || toolName?.includes('create')) return FileText
  if (toolName?.includes('message') || toolName?.includes('email')) return Mail
  return Calculator
}

const getStepDescription = (step) => {
  const toolName = step.name || 'Unknown'

  if (toolName.includes('find')) {
    const collection = step.args?.collection || 'documents'
    return `🔍 find() on ${collection}`
  }

  if (toolName.includes('insertOne')) {
    const collection = step.args?.collection || 'collection'
    return `📝 insertOne → ${collection}`
  }

  if (toolName.includes('aggregate')) {
    return `💰 aggregate() calculation`
  }

  return `⚙️ ${toolName}`
}

const getStepResult = (step) => {
  if (!step.result) return 'Processing...'

  try {
    // Try to parse result as JSON
    const parsed = typeof step.result === 'string' ? JSON.parse(step.result) : step.result

    if (Array.isArray(parsed)) {
      return `Found ${parsed.length} items`
    }

    if (parsed.insertedId) {
      return `Saved: id ${parsed.insertedId.toString().slice(-6)}...`
    }

    if (parsed.message) {
      return parsed.message
    }

    return 'Completed'
  } catch (e) {
    // If not JSON, return first 50 chars
    const text = String(step.result)
    return text.length > 50 ? text.slice(0, 50) + '...' : text
  }
}

export default function AgentSteps({ steps }) {
  const [visibleSteps, setVisibleSteps] = useState(0)

  useEffect(() => {
    if (steps.length === 0) return

    const timer = setInterval(() => {
      setVisibleSteps(prev => {
        if (prev < steps.length) {
          return prev + 1
        }
        clearInterval(timer)
        return prev
      })
    }, 150) // 150ms stagger between steps

    return () => clearInterval(timer)
  }, [steps.length])

  if (steps.length === 0) return null

  return (
    <div className="space-y-2">
      {steps.slice(0, visibleSteps).map((step, index) => {
        const Icon = getStepIcon(step.name)
        const description = getStepDescription(step)
        const result = getStepResult(step)

        return (
          <div
            key={index}
            className="flex items-center space-x-3 p-2 bg-surface-3/50 rounded-lg step-chip"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Icon size={16} className="text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-2">{description}</div>
              <div className="text-xs text-text-4 truncate">{result}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}