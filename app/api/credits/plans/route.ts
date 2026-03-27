import { NextResponse } from "next/server"

// Mock pricing plans
const PLANS = {
  monthly: [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Basic features for personal use",
      features: {
        included: [
          "Up to 3 projects",
          "1 GB storage",
          "Basic analytics",
          "Community support",
        ],
        excluded: ["Custom domains", "Custom branding", "Lifetime updates"],
      },
      popular: false,
    },
    {
      id: "pro-monthly",
      name: "Pro",
      price: 9.9,
      description: "Advanced features for professionals",
      features: {
        included: [
          "Unlimited projects",
          "10 GB storage",
          "Advanced analytics",
          "Priority support",
          "Custom domains",
        ],
        excluded: ["Custom branding", "Lifetime updates"],
      },
      popular: true,
      stripePriceId: "price_mock_pro_monthly",
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: 199,
      description: "Premium features with one-time payment",
      features: {
        included: [
          "All Pro features",
          "100 GB storage",
          "Dedicated support",
          "Enterprise-grade security",
          "Advanced integrations",
          "Custom branding",
          "Lifetime updates",
        ],
        excluded: [],
      },
      popular: false,
      stripePriceId: "price_mock_lifetime",
    },
  ],
  yearly: [
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Basic features for personal use",
      features: {
        included: [
          "Up to 3 projects",
          "1 GB storage",
          "Basic analytics",
          "Community support",
        ],
        excluded: ["Custom domains", "Custom branding", "Lifetime updates"],
      },
      popular: false,
    },
    {
      id: "pro-yearly",
      name: "Pro",
      price: 99,
      description: "Advanced features for professionals",
      features: {
        included: [
          "Unlimited projects",
          "10 GB storage",
          "Advanced analytics",
          "Priority support",
          "Custom domains",
        ],
        excluded: ["Custom branding", "Lifetime updates"],
      },
      popular: true,
      stripePriceId: "price_mock_pro_yearly",
    },
    {
      id: "lifetime",
      name: "Lifetime",
      price: 199,
      description: "Premium features with one-time payment",
      features: {
        included: [
          "All Pro features",
          "100 GB storage",
          "Dedicated support",
          "Enterprise-grade security",
          "Advanced integrations",
          "Custom branding",
          "Lifetime updates",
        ],
        excluded: [],
      },
      popular: false,
      stripePriceId: "price_mock_lifetime",
    },
  ],
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  await delay(200)

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "monthly"

    const plans = period === "yearly" ? PLANS.yearly : PLANS.monthly

    return NextResponse.json({
      success: true,
      data: plans,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An error occurred while fetching plans",
        },
      },
      { status: 500 }
    )
  }
}
