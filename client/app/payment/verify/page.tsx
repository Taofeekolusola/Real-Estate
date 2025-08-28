"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { verifyPayment } from "@/store/slices/paymentSlice"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Payment } from "@/types"

export default function PaymentVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { currentPayment, error } = useAppSelector((state) => state.payment)

  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed">("loading")
  const reference = searchParams.get("reference")

  useEffect(() => {
    if (!reference) {
      setVerificationStatus("failed")
      return
    }

    dispatch(verifyPayment(reference))
      .unwrap()
      .then((result: { payment?: Payment }) => {
        setVerificationStatus(result.payment?.status === "success" ? "success" : "failed")
      })
      .catch(() => setVerificationStatus("failed"))
  }, [reference, dispatch])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const handleNavigation = (path: string) => router.push(path)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Payment Verification</CardTitle>
          </CardHeader>
          <CardContent>
            {verificationStatus === "loading" && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Verifying Payment</h3>
                <p className="text-gray-600">Please wait while we confirm your payment...</p>
              </div>
            )}

            {verificationStatus === "success" && currentPayment && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">Your rental payment has been processed successfully.</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 space-y-3 text-left">
                  <div className="flex justify-between"><span className="font-medium">Amount Paid:</span><span className="font-bold text-green-600">{formatCurrency(currentPayment.amount)}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Reference:</span><span className="font-mono text-sm">{currentPayment.reference}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Date:</span><span>{formatDate(currentPayment.createdAt)}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Status:</span><span className="text-green-600 font-semibold">Completed</span></div>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => handleNavigation("/tenant/bookings")} className="w-full">
                    <ArrowRight className="h-4 w-4 mr-2" /> View My Bookings
                  </Button>
                  <Button variant="outline" onClick={() => handleNavigation("/tenant")} className="w-full bg-transparent">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {verificationStatus === "failed" && (
              <div className="text-center py-8">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't verify your payment. This could be due to a network issue or payment cancellation.
                </p>

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Button onClick={() => handleNavigation("/tenant/bookings")} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => handleNavigation("/tenant")} className="w-full bg-transparent">
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}