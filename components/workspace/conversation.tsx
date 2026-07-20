'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import type { ConversationMessage } from '@/lib/types'

export function Conversation() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! Do you have any questions about the design recommendations? I&apos;m here to help adjust or clarify any details.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: ConversationMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ConversationMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto space-y-3 border border-border rounded-lg p-4 bg-accent/5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a follow-up question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="bg-background"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function generateMockResponse(userInput: string): string {
  const responses: { [key: string]: string } = {
    budget: 'Based on the current selection, you are spending ₹45,000 on seating and around ₹32,000 on storage, leaving room for additional accessories.',
    furniture: 'The modern gray sofa is ideal for contemporary spaces. It offers excellent comfort and pairs well with the minimalist coffee table.',
    style: 'The Scandinavian style focuses on natural materials, clean lines, and functionality. All recommended items align with these principles.',
    dimensions: 'The furniture has been selected to fit your room dimensions while maintaining at least 30% walking space.',
    color: 'The neutral gray and wood tones create a cohesive look that works with various color schemes.',
  }

  const lowerInput = userInput.toLowerCase()
  for (const [key, response] of Object.entries(responses)) {
    if (lowerInput.includes(key)) {
      return response
    }
  }

  return "That's a great question! Feel free to ask me anything about the design recommendations, furniture choices, budget, or room layout. I'm here to help you make the best decision for your space."
}
