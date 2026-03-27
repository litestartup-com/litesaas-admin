"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: {
    included: string[]
    excluded: string[]
  }
  popular?: boolean
  stripePriceId?: string
}

export function CreditsContent() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const plansRes = await fetchWithAuth(`/api/credits/plans?period=${period}`)
      if (plansRes.status === 401) return
      const plansData = await plansRes.json()

      if (plansData.success) setPlans(plansData.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async (plan: Plan) => {
    if (plan.price === 0) {
      // Free plan - no checkout needed
      return
    }

    setProcessing(plan.id)
    try {
      const response = await fetchWithAuth("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
          planName: plan.name,
          amount: plan.price,
        }),
      })
      if (response.status === 401) return

      const result = await response.json()

      if (result.success) {
        // In real app, redirect to Stripe checkout URL
        // For mock, simulate success
        alert(`Mock: Would redirect to Stripe checkout for ${plan.name} plan`)
        // window.location.href = result.data.url
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert("Failed to initiate checkout. Please try again.")
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Pricing Plans Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Pricing</h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Period Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border p-1 bg-muted">
            <button
              onClick={() => setPeriod("monthly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                period === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                period === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="text-center py-12">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative", "border-primary shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      {plan.price > 0 && (
                        <span className="text-lg font-normal text-muted-foreground">
                          {period === "monthly" ? " /month" : " /year"}
                        </span>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.price !== 0 && (
                    <Button
                      className={cn(
                        "w-full", "bg-primary hover:bg-primary/90"
                      )}
                      onClick={() => handleCheckout(plan)}
                      disabled={processing === plan.id}
                    >
                      {processing === plan.id
                        ? t('credits.processing')
                        : plan.price === 0
                        ? t('credits.getStartedForFree')
                        : t('credits.getStarted')}
                    </Button>  
                  )}

                  <div className="space-y-2 pt-4">
                    {plan.features.included.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.features.excluded.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 opacity-50">
                        <X className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
