"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchMyBookings, cancelBooking } from "@/store/slices/bookingSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { Calendar, MapPin, User, MessageSquare, Eye, Clock, CreditCard, X } from "lucide-react"
import { toast } from "sonner"

export default function TenantBookingsPage() {
  const dispatch = useAppDispatch()
  const { bookings, isLoading, error } = useAppSelector((state) => state.booking)

  useEffect(() => {
    dispatch(fetchMyBookings())
  }, [dispatch])

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[v0] Cancelling booking:", bookingId)
      await dispatch(cancelBooking(bookingId)).unwrap()
      await dispatch(fetchMyBookings())
      toast.success("Booking cancelled successfully")
    } catch (error) {
      console.error("[v0] Failed to cancel booking:", error)
      toast.error("Failed to cancel booking")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Booking Requests</h1>
            <p className="text-gray-600">Track your property inspection requests</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (bookings || []).length > 0 ? (
            <div className="space-y-6">
              {(bookings || []).map((booking) => (
                <Card key={booking._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{booking.property.title}</CardTitle>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{booking.property.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>
                            Landlord:{" "}
                            {booking.landlord && typeof booking.landlord === "object" && booking.landlord.name
                              ? booking.landlord.name
                              : "Unknown Landlord"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                        {booking.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 mt-1 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Your Message:</p>
                          <p className="text-gray-600">{booking.message}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Requested on {formatDate(booking.createdAt)}</span>
                      </div>

                      {booking.inspectionDate && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <Calendar className="h-4 w-4" />
                          <span>Inspection scheduled for {formatDate(booking.inspectionDate)}</span>
                        </div>
                      )}

                      <div className="flex space-x-3 pt-4">
                        <Link href={`/properties/${booking.property._id}`}>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                            <Eye className="h-4 w-4" />
                            <span>View Property</span>
                          </Button>
                        </Link>

                        {booking.status === "approved" && (
                          <Link href={`/tenant/bookings/${booking._id}/payment`}>
                            <Button size="sm" className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4" />
                              <span>Proceed to Payment</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Booking Requests</h3>
                <p className="text-gray-600 mb-4">You haven't made any inspection requests yet</p>
                <Link href="/properties">
                  <Button>Browse Properties</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
