// app/api/agent/route.js - Proxy to ADK agent
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message, householdId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const agentServerUrl = process.env.AGENT_SERVER_URL || 'http://localhost:8000'

    // ADK REST API format (from Agent Starter Pack)
    const res = await fetch(`${agentServerUrl}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_name: 'roomieai',
        user_id: 'demo_user',
        session_id: `session_${householdId || 'default'}`,
        new_message: {
          role: 'user',
          parts: [{ text: message }]
        }
      })
    })

    if (!res.ok) {
      console.error('Agent server error:', res.status, res.statusText)
      return NextResponse.json(
        { error: 'Agent server is not available' },
        { status: 503 }
      )
    }

    const data = await res.json()

    // Parse ADK event list into steps + final text
    const steps = []
    let finalText = ''

    for (const event of (data.events || [])) {
      if (event.content?.parts) {
        for (const part of event.content.parts) {
          if (part.function_call) {
            steps.push({
              type: 'tool_call',
              name: part.function_call.name,
              args: part.function_call.args
            })
          }
          if (part.function_response) {
            const lastStep = steps[steps.length - 1]
            if (lastStep) {
              lastStep.result = part.function_response.response
            }
          }
          if (part.text && event.content.role === 'model') {
            finalText = part.text
          }
        }
      }
    }

    return NextResponse.json({
      steps,
      text: finalText,
      success: true
    })

  } catch (error) {
    console.error('Agent proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}