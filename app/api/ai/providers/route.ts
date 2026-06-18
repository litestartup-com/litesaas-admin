import { NextResponse } from "next/server"

const PROVIDERS = [
  {
    id: "fast",
    name: "Fast",
    description: "Quick responses, low cost",
    icon: "Bolt",
  },
  {
    id: "smart",
    name: "Smart",
    description: "Balanced quality and speed",
    icon: "Brain",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Best quality, higher cost",
    icon: "Sparkles",
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
