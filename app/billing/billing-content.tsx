"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/i18n"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

interface CurrentPlan {
  id: string
  name: string
  price: number
  period: string | null
  status: string
  expiresAt: string | null
}

interface Order {
  id: string
  orderDate: string
  orderNumber: string
  amount: number
  currency: string
  status: string
}

export function BillingContent() {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [planRes, ordersRes] = await Promise.all([
        fetchWithAuth("/api/billing/current-plan"),
        fetchWithAuth("/api/billing/orders"),
      ])
      
      if (planRes.status === 401 || ordersRes.status === 401) return

      const planData = await planRes.json()
      const ordersData = await ordersRes.json()

      if (planData.success) setCurrentPlan(planData.data)
      if (ordersData.success) setOrders(ordersData.data)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    // Navigate to credits page for plan selection
    router.push("/credits")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('billing.title')}</h1>
        <p className="text-muted-foreground">{t('billing.description')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : currentPlan ? (
              <>
                <div className="text-4xl font-bold">{currentPlan.name}</div>
                {currentPlan.name !== "Free" && (
                  <div className="text-sm text-muted-foreground">
                    ${currentPlan.price}
                    {currentPlan.period === "monthly" ? "/month" : "/year"}
                  </div>
                )}
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleUpgrade}
                >
                  Upgrade
                </Button>
              </>
            ) : (
              <div className="text-muted-foreground">No plan found</div>
            )}
          </CardContent>
        </Card>

        {/* Order History Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.orderDate')}</TableHead>
                    <TableHead>{t('billing.orderNumber')}</TableHead>
                    <TableHead>{t('billing.amount')}</TableHead>
                    <TableHead>{t('billing.currency')}</TableHead>
                    <TableHead>{t('billing.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>${order.amount}</TableCell>
                      <TableCell>{order.currency}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
