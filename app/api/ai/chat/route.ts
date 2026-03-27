import { NextResponse } from "next/server"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: Request) {
  await delay(1000) // Simulate AI response delay

  try {
    const body = await request.json()
    const { message, provider, conversationId } = body

    // Validation
    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Message is required",
          },
        },
        { status: 400 }
      )
    }

    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Provider is required",
          },
        },
        { status: 400 }
      )
    }

    // Mock AI response based on provider
    const mockResponses: Record<string, string[]> = {
      "gpt-4o": [
        "I'm GPT-4o, OpenAI's latest model. I can help you with a wide range of tasks including coding, analysis, creative writing, and more. How can I assist you today?",
        "That's an interesting question! Let me think about this... Based on what you've asked, I'd suggest considering multiple perspectives and approaches.",
        "I understand your concern. Here's a comprehensive answer that addresses your question from several angles.",
      ],
      "gpt-4": [
        "I'm GPT-4, a powerful language model. I can help you with various tasks. What would you like to know?",
        "That's a great question! Let me provide you with a detailed response.",
        "I can help you with that. Here's what I think...",
      ],
      "claude-3": [
        "I'm Claude 3, an AI assistant created by Anthropic. I'm designed to be helpful, harmless, and honest. How can I assist you?",
        "Thank you for your question. I'll do my best to provide a thoughtful and accurate response.",
        "I appreciate you asking. Let me share my perspective on this topic.",
      ],
      "gemini-pro": [
        "I'm Gemini Pro, Google's advanced AI model. I'm here to help you with information, analysis, and creative tasks. What can I do for you?",
        "That's an excellent question! I'll provide you with a comprehensive answer.",
        "I understand what you're looking for. Here's my response to help you out.",
      ],
    }

    const responses = mockResponses[provider] || mockResponses["gpt-4o"]
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    // Mock: Generate a more contextual response
    const contextualResponse = `${randomResponse} You asked: "${message.substring(0, 50)}${message.length > 50 ? "..." : ""}". This is a mock response from ${provider}. In a real implementation, this would be an actual AI-generated response.`

    return NextResponse.json({
      success: true,
      data: {
        id: `msg_${Date.now()}`,
        message: contextualResponse,
        provider,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while processing your message",
        },
      },
      { status: 500 }
    )
  }
}
