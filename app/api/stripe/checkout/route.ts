import { NextResponse } from "next/server"

// Mock Stripe checkout session creation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST(request: Request) {
  await delay(300)

  try {
    const body = await request.json()
    const { priceId, planId, planName, amount } = body

    // Validation
    if (!priceId && !planId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Price ID or Plan ID is required",
          },
        },
        { status: 400 }
      )
    }

    // Mock: In real app, create Stripe checkout session
    // const session = await stripe.checkout.sessions.create({...})
    
    // Mock checkout session
    const mockSession = {
      id: `cs_mock_${Date.now()}`,
      url: `/checkout/success?session_id=cs_mock_${Date.now()}`,
      priceId: priceId || `price_mock_${planId}`,
      planId,
      planName,
      amount,
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: mockSession.id,
        url: mockSession.url,
        // In real app, redirect to Stripe checkout
        // For mock, we'll simulate success
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while creating checkout session",
        },
      },
      { status: 500 }
    )
  }
}
