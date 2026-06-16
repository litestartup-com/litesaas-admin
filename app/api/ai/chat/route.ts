import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/api-auth"
import { lsChatCompletion, type LSChatMessage } from "@/lib/ls-client"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Require authenticated user for AI chat
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return auth.response!
    }

    const body = await request.json()
    const { message, provider, conversationId, messages: history } = body

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

    // Build message array for LS LLM Router
    const llmMessages: LSChatMessage[] = []

    // Append conversation history if provided
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        llmMessages.push({
          role: msg.role || "user",
          content: msg.content || msg.message || "",
        })
      }
    }

    // Add current message
    llmMessages.push({ role: "user", content: message })

    const result = await lsChatCompletion(llmMessages, provider)
    const assistantContent =
      result.choices?.[0]?.message?.content || "No response generated."

    return NextResponse.json({
      success: true,
      data: {
        id: result.id || `msg_${Date.now()}`,
        message: assistantContent,
        provider: provider || "default",
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
        usage: result.usage || null,
      },
    })
  } catch (error: any) {
    const status = error?.status || 500
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_ERROR",
          message: error?.message || "An error occurred while processing your message",
        },
      },
      { status }
    )
  }
}
