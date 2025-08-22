// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { fetchMyBookings } from "@/store/slices/bookingSlice"
// import { initializePayment, clearError } from "@/store/slices/paymentSlice"
// import { AuthGuard } from "@/components/auth/auth-guard"
// import { Navbar } from "@/components/layout/navbar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, CreditCard, Shield, CheckCircle, MapPin, User, Calendar } from "lucide-react"

// export default function PaymentPage() {
//   const params = useParams()
//   const router = useRouter()
//   const dispatch = useAppDispatch()
//   const { bookings } = useAppSelector((state) => state.booking)
//   const { isLoading, error } = useAppSelector((state) => state.payment)
//   const { user } = useAppSelector((state) => state.auth)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [localError, setLocalError] = useState<string | null>(null)
//   const [manualAmount, setManualAmount] = useState<string>("")
//   const [useManualAmount, setUseManualAmount] = useState(false)

//   const bookingId = params.id as string
//   const booking = bookings.find((b) => b._id === bookingId)

//   useEffect(() => {
//     if (bookings.length === 0) {
//       dispatch(fetchMyBookings())
//     }
//   }, [dispatch, bookings.length])

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => {
//         dispatch(clearError())
//       }, 10000)
//       return () => clearTimeout(timer)
//     }
//   }, [error, dispatch])

//   useEffect(() => {
//     if (localError) {
//       const timer = setTimeout(() => {
//         setLocalError(null)
//       }, 10000)
//       return () => clearTimeout(timer)
//     }
//   }, [localError])

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//     }).format(amount)
//   }

//   const calculateTotal = () => {
//     if (!booking) return 0

//     if (!booking.property || !booking.property.rentAmount) {
//       return 0
//     }

//     const rentAmount = Number(booking.property.rentAmount) || 0
//     const agencyFee = Number(booking.property.agencyFee) || 0
//     const legalFee = Number(booking.property.legalFee) || 0
//     const total = rentAmount + agencyFee + legalFee
//     return Math.round(total)
//   }

//   const getPaymentAmount = () => {
//     if (useManualAmount) {
//       return Number(manualAmount) || 0
//     }
//     return calculateTotal()
//   }

//   const handlePayment = async () => {
//     if (!booking || !user) {
//       setLocalError("Missing booking or user information")
//       return
//     }

//     if (!user.email) {
//       setLocalError("User email is required for payment")
//       return
//     }

//     const paymentAmount = getPaymentAmount()

//     if (!paymentAmount || paymentAmount <= 0 || isNaN(paymentAmount)) {
//       setLocalError("Please enter a valid payment amount")
//       return
//     }

//     setLocalError(null)
//     dispatch(clearError())

//     setIsProcessing(true)
//     try {
//       console.log("Payment data being sent:", {
//         email: user.email,
//         amount: paymentAmount,
//         bookingId: booking._id,
//         amountType: typeof paymentAmount,
//         useManualAmount,
//         manualAmount: useManualAmount ? manualAmount : null,
//       })

//       const cleanAmount = Math.floor(Math.abs(paymentAmount))

//       const paymentData = {
//         email: user.email.trim(),
//         amount: cleanAmount,
//         bookingId: booking._id,
//         callback_url: `${window.location.origin}/payment/verify`,
//         cancel_url: `${window.location.origin}/tenant/bookings/${booking._id}/payment`,
//       }

//       console.log("Final payment data:", paymentData)

//       const result = await dispatch(initializePayment(paymentData)).unwrap()

//       console.log("Payment initialization successful:", result)
//       console.log("Full response structure:", JSON.stringify(result, null, 2))

//       const paymentUrl =
//         result.data?.authorization_url ||
//         result.authorization_url ||
//         result.paymentUrl ||
//         result.data?.checkout_url ||
//         result.data?.payment_url ||
//         result.checkout_url ||
//         result.payment_url ||
//         result.url ||
//         result.data?.url

//       const reference = result.data?.reference || result.reference

//       if (paymentUrl) {
//         console.log("Redirecting to payment URL:", paymentUrl)
//         console.log("Payment reference:", reference)

//         sessionStorage.setItem("paymentBookingId", booking._id)
//         if (reference) {
//           sessionStorage.setItem("paymentReference", reference)
//         }

//         // Open in new tab to avoid blocking
//         const paymentWindow = window.open(paymentUrl, "_blank", "noopener,noreferrer")

//         if (!paymentWindow) {
//           // If popup is blocked, try direct redirect as fallback
//           console.log("Popup blocked, trying direct redirect...")
//           window.location.href = paymentUrl
//         } else {
//           // Monitor the payment window
//           const checkClosed = setInterval(() => {
//             if (paymentWindow.closed) {
//               clearInterval(checkClosed)
//               // Redirect to verification page to check payment status
//               router.push(`/payment/verify?reference=${reference || "unknown"}`)
//             }
//           }, 1000)
//         }
//       } else {
//         console.error("No payment URL found in response:", result)
//         console.error("Available fields:", Object.keys(result))
//         if (result.data) {
//           console.error("Available data fields:", Object.keys(result.data))
//         }
//         setLocalError("Payment URL not received from server. Please check console for details and try again.")
//       }
//     } catch (error: any) {
//       console.error("Payment initialization failed:", error)

//       let errorMessage = "Failed to initialize payment"

//       if (error.response?.data) {
//         if (typeof error.response.data === "string") {
//           errorMessage = error.response.data
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message
//         } else if (error.response.data.error) {
//           errorMessage = error.response.data.error
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       setLocalError(errorMessage)
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   if (!booking) {
//     return (
//       <AuthGuard allowedRoles={["tenant"]}>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="text-center">
//               <p className="text-gray-500">Booking not found</p>
//               <Button onClick={() => router.back()} className="mt-4">
//                 Go Back
//               </Button>
//             </div>
//           </div>
//         </div>
//       </AuthGuard>
//     )
//   }

//   if (booking.status !== "approved") {
//     return (
//       <AuthGuard allowedRoles={["tenant"]}>
//         <div className="min-h-screen bg-gray-50">
//           <Navbar />
//           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="text-center">
//               <p className="text-gray-500">This booking is not approved for payment</p>
//               <Button onClick={() => router.back()} className="mt-4">
//                 Go Back
//               </Button>
//             </div>
//           </div>
//         </div>
//       </AuthGuard>
//     )
//   }

//   return (
//     <AuthGuard allowedRoles={["tenant"]}>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
//             <ArrowLeft className="h-4 w-4" />
//             <span>Back to Bookings</span>
//           </Button>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Payment Form */}
//             <div className="lg:col-span-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <CreditCard className="h-5 w-5" />
//                     <span>Complete Payment</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {(error || localError) && (
//                     <Alert variant="destructive" className="mb-6">
//                       <AlertDescription>{localError || error}</AlertDescription>
//                     </Alert>
//                   )}

//                   <div className="space-y-6">
//                     {/* Property Details */}
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-semibold">Property Details</h3>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <h4 className="font-semibold text-lg mb-2">{booking.property?.title || "Property"}</h4>
//                         <div className="flex items-center text-gray-600 mb-2">
//                           <MapPin className="h-4 w-4 mr-2" />
//                           <span>{booking.property?.address || "Address not available"}</span>
//                         </div>
//                         <div className="flex items-center text-gray-600 mb-2">
//                           <User className="h-4 w-4 mr-2" />
//                           <span>
//                             Landlord:{" "}
//                             {booking.landlord && typeof booking.landlord === "object" && booking.landlord.name
//                               ? booking.landlord.name
//                               : "Unknown Landlord"}
//                           </span>
//                         </div>
//                         <div className="flex items-center text-gray-600">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           <span>Duration: {booking.property?.durationInMonths || "N/A"} months</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Manual Amount Input */}
//                     {(!booking.property?.rentAmount || useManualAmount) && (
//                       <div className="space-y-4">
//                         <h3 className="text-lg font-semibold">Payment Amount</h3>
//                         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                           <p className="text-yellow-800 text-sm mb-4">
//                             Property pricing details are not available. Please enter the payment amount manually.
//                           </p>
//                           <div className="space-y-4">
//                             <div>
//                               <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
//                                 Payment Amount (NGN)
//                               </label>
//                               <input
//                                 type="number"
//                                 id="amount"
//                                 value={manualAmount}
//                                 onChange={(e) => setManualAmount(e.target.value)}
//                                 placeholder="Enter amount (e.g., 2500000)"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                               />
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <input
//                                 type="checkbox"
//                                 id="useManual"
//                                 checked={useManualAmount}
//                                 onChange={(e) => setUseManualAmount(e.target.checked)}
//                                 className="rounded"
//                               />
//                               <label htmlFor="useManual" className="text-sm text-gray-700">
//                                 Use manual amount
//                               </label>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Payment Security */}
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <Shield className="h-5 w-5 text-blue-600" />
//                         <span className="font-semibold text-blue-900">Secure Payment</span>
//                       </div>
//                       <p className="text-blue-800 text-sm">
//                         Your payment is processed securely through Paystack. Your card details are encrypted and never
//                         stored on our servers.
//                       </p>
//                     </div>

//                     {/* Payment Button */}
//                     <Button
//                       onClick={handlePayment}
//                       disabled={isLoading || isProcessing || getPaymentAmount() <= 0}
//                       className="w-full py-3 text-lg"
//                       size="lg"
//                     >
//                       {isLoading || isProcessing ? (
//                         "Processing..."
//                       ) : (
//                         <>
//                           <CreditCard className="h-5 w-5 mr-2" />
//                           Pay {formatCurrency(getPaymentAmount())}
//                         </>
//                       )}
//                     </Button>

//                     <div className="text-center text-sm text-gray-500">
//                       <p>By proceeding, you agree to our terms and conditions</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Payment Summary */}
//             <div>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Payment Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {useManualAmount ? (
//                       <div className="flex justify-between">
//                         <span>Payment Amount</span>
//                         <span>{formatCurrency(Number(manualAmount) || 0)}</span>
//                       </div>
//                     ) : booking.property?.rentAmount ? (
//                       <>
//                         <div className="flex justify-between">
//                           <span>Rent Amount</span>
//                           <span>{formatCurrency(Number(booking.property.rentAmount) || 0)}</span>
//                         </div>

//                         {Number(booking.property.agencyFee) > 0 && (
//                           <div className="flex justify-between">
//                             <span>Agency Fee</span>
//                             <span>{formatCurrency(Number(booking.property.agencyFee) || 0)}</span>
//                           </div>
//                         )}

//                         {Number(booking.property.legalFee) > 0 && (
//                           <div className="flex justify-between">
//                             <span>Legal Fee</span>
//                             <span>{formatCurrency(Number(booking.property.legalFee) || 0)}</span>
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div className="text-center text-gray-500">
//                         <p>Enter payment amount above</p>
//                       </div>
//                     )}

//                     <Separator />

//                     <div className="flex justify-between font-semibold text-lg">
//                       <span>Total</span>
//                       <span>{formatCurrency(getPaymentAmount())}</span>
//                     </div>

//                     <div className="mt-6">
//                       <Badge variant="default" className="w-full justify-center py-2">
//                         <CheckCircle className="h-4 w-4 mr-2" />
//                         Booking Approved
//                       </Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Payment Methods */}
//               <Card className="mt-6">
//                 <CardHeader>
//                   <CardTitle className="text-sm">Accepted Payment Methods</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 text-sm text-gray-600">
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                       <span>Visa & Mastercard</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                       <span>Bank Transfer</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                       <span>USSD</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                       <span>Mobile Money</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchMyBookings } from "@/store/slices/bookingSlice"
import { initializePayment, clearError } from "@/store/slices/paymentSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Shield, CheckCircle, MapPin, User, Calendar } from "lucide-react"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { bookings } = useAppSelector((state) => state.booking)
  const { isLoading, error } = useAppSelector((state) => state.payment)
  const { user } = useAppSelector((state) => state.auth)

  const [isProcessing, setIsProcessing] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [manualAmount, setManualAmount] = useState<string>("")
  const [useManualAmount, setUseManualAmount] = useState(false)

  const bookingId = params.id as string
  const booking = bookings.find((b) => b._id === bookingId)

  // Fetch bookings if not available
  useEffect(() => {
    if (bookings.length === 0) dispatch(fetchMyBookings())
  }, [dispatch, bookings.length])

  // Clear errors automatically after 10s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 10000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(null), 10000)
      return () => clearTimeout(timer)
    }
  }, [localError])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)

  const calculateTotal = () => {
    if (!booking?.property) return 0
    const rent = Number(booking.property.rentAmount) || 0
    const agency = Number(booking.property.agencyFee) || 0
    const legal = Number(booking.property.legalFee) || 0
    return Math.round(rent + agency + legal)
  }

  const getPaymentAmount = () => (useManualAmount ? Number(manualAmount) || 0 : calculateTotal())

  const handlePayment = async () => {
    if (!booking || !user?.email) {
      setLocalError("Missing booking or user information")
      return
    }

    const amount = getPaymentAmount()
    if (!amount || amount <= 0 || isNaN(amount)) {
      setLocalError("Please enter a valid payment amount")
      return
    }

    setLocalError(null)
    dispatch(clearError())
    setIsProcessing(true)

    try {
      const paymentData = {
        email: user.email.trim(),
        amount: Math.floor(Math.abs(amount)),
        bookingId: booking._id,
        callback_url: `${window.location.origin}/payment/verify`,
        cancel_url: `${window.location.origin}/tenant/bookings/${booking._id}/payment`,
      }

      const result = await dispatch(initializePayment(paymentData)).unwrap()
      const paymentUrl =
        result.data?.authorization_url ||
        result.authorization_url ||
        result.paymentUrl ||
        result.data?.checkout_url ||
        result.data?.payment_url ||
        result.checkout_url ||
        result.payment_url ||
        result.url ||
        result.data?.url

      const reference = result.data?.reference || result.reference
      if (!paymentUrl) throw new Error("Payment URL not received")

      sessionStorage.setItem("paymentBookingId", booking._id)
      if (reference) sessionStorage.setItem("paymentReference", reference)

      const paymentWindow = window.open(paymentUrl, "_blank", "noopener,noreferrer")
      if (!paymentWindow) window.location.href = paymentUrl
      else {
        const checkClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkClosed)
            router.push(`/payment/verify?reference=${reference || "unknown"}`)
          }
        }, 1000)
      }
    } catch (err: any) {
      console.error("Payment initialization failed:", err)
      let message = "Failed to initialize payment"
      if (err.response?.data) {
        message =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || err.response.data.error || message
      } else if (err.message) message = err.message
      setLocalError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle invalid booking or unapproved booking
  if (!booking || booking.status !== "approved") {
    const msg = !booking ? "Booking not found" : "This booking is not approved for payment"
    return (
      <AuthGuard allowedRoles={["tenant"]}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-gray-500">{msg}</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Bookings</span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Complete Payment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(error || localError) && (
                    <Alert variant="destructive">
                      <AlertDescription>{localError || error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Property Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Property Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-lg">{booking.property?.title || "Property"}</h4>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{booking.property?.address || "Address not available"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>
                          Landlord:{" "}
                          {booking.landlord?.name || "Unknown Landlord"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Duration: {booking.property?.durationInMonths || "N/A"} months</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Amount */}
                  {(!booking.property?.rentAmount || useManualAmount) && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Payment Amount</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-4">
                        <p className="text-yellow-800 text-sm">
                          Property pricing details are not available. Please enter the payment amount manually.
                        </p>
                        <input
                          type="number"
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          placeholder="Enter amount (e.g., 2500000)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={useManualAmount}
                            onChange={(e) => setUseManualAmount(e.target.checked)}
                            className="rounded"
                          />
                          <label className="text-sm text-gray-700">Use manual amount</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Security */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-1" />
                    <p className="text-blue-800 text-sm">
                      Your payment is processed securely through Paystack. Your card details are encrypted and never stored on our servers.
                    </p>
                  </div>

                  {/* Pay Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading || isProcessing || getPaymentAmount() <= 0}
                    className="w-full py-3 text-lg"
                    size="lg"
                  >
                    {isLoading || isProcessing ? "Processing..." : `Pay ${formatCurrency(getPaymentAmount())}`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {useManualAmount ? (
                    <div className="flex justify-between">{formatCurrency(Number(manualAmount) || 0)}</div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Rent Amount</span>
                        <span>{formatCurrency(Number(booking.property.rentAmount) || 0)}</span>
                      </div>
                      {Number(booking.property.agencyFee) > 0 && (
                        <div className="flex justify-between">
                          <span>Agency Fee</span>
                          <span>{formatCurrency(Number(booking.property.agencyFee))}</span>
                        </div>
                      )}
                      {Number(booking.property.legalFee) > 0 && (
                        <div className="flex justify-between">
                          <span>Legal Fee</span>
                          <span>{formatCurrency(Number(booking.property.legalFee))}</span>
                        </div>
                      )}
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(getPaymentAmount())}</span>
                  </div>

                  <Badge variant="default" className="w-full justify-center py-2 mt-4 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Booking Approved</span>
                  </Badge>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Accepted Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  {["Visa & Mastercard", "Bank Transfer", "USSD", "Mobile Money"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{method}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}