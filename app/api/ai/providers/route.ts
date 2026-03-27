import { NextResponse } from "next/server"

// Mock AI providers
const PROVIDERS = [
  {
    id: "gpt-4o",
    name: "GPT 4o",
    description: "OpenAI's latest model",
    icon: "OpenAI",
  },
  {
    id: "gpt-4",
    name: "GPT 4",
    description: "OpenAI GPT-4",
    icon: "OpenAI",
  },
  {
    id: "claude-3",
    name: "Claude 3",
    description: "Anthropic's Claude 3",
    icon: "Anthropic",
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's Gemini Pro",
    icon: "Google",
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  await delay(200)

  return NextResponse.json({
    success: true,
    data: PROVIDERS,
  })
}
