"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchLandlordBookings, updateBookingStatus } from "@/store/slices/bookingSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { MapPin, User, MessageSquare, Eye, Clock, Check, X, Phone, Mail } from "lucide-react"
import { Booking } from "@/types"
export default function LandlordBookingsPage() {
  const dispatch = useAppDispatch()
  const { bookings, isLoading, error } = useAppSelector((state) => state.booking)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState("")

  useEffect(() => {
    dispatch(fetchLandlordBookings())
  }, [dispatch])

  const pendingBookings = (bookings || []).filter((booking: Booking) => booking.status === "pending")
  const approvedBookings = (bookings || []).filter((booking: Booking) => booking.status === "approved")
  const rejectedBookings = (bookings || []).filter((booking: Booking) => booking.status === "rejected")

  const handleStatusUpdate = async (bookingId: string, status: "approved" | "rejected") => {
    setActionLoading(bookingId)
    setActionError("")

    try {
      await dispatch(updateBookingStatus({ bookingId, status })).unwrap()
      setActionError("")
      dispatch(fetchLandlordBookings())
    } catch (error: any) {
      const errorMsg = error || "Failed to update booking status"
      setActionError(errorMsg)

      dispatch(fetchLandlordBookings())

      if (errorMsg.includes("email notification failed")) {
        setTimeout(() => {
          dispatch(fetchLandlordBookings())
        }, 2000)
      }
    } finally {
      setActionLoading(null)
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

  const BookingCard = ({ booking }: { booking: any }) => (
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
              <span>Tenant: {booking.tenant.name}</span>
            </div>
          </div>
          <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 mt-1 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Tenant's Message:</p>
              <p className="text-gray-600">{booking.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Contact Information:</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                <Phone className="h-3 w-3" />
                <span>{booking.tenant.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{booking.tenant.email}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Requested on {formatDate(booking.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Link href={`/properties/${booking.property._id}`}>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <Eye className="h-4 w-4" />
                <span>View Property</span>
              </Button>
            </Link>

            {booking.status === "pending" && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      disabled={actionLoading === booking._id}
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Inspection Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this inspection request? The tenant will be notified and can
                        proceed with payment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusUpdate(booking._id, "approved")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 bg-transparent"
                      disabled={actionLoading === booking._id}
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Inspection Request</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this inspection request? The tenant will be notified.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleStatusUpdate(booking._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
            <p className="text-gray-600">Manage property inspection requests from tenants</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {actionError && (
            <Alert
              variant={actionError.includes("email notification failed") ? "default" : "destructive"}
              className="mb-6"
            >
              <AlertDescription>
                {actionError}
                {actionError.includes("email notification failed") && (
                  <div className="mt-2 text-sm">
                    The booking status has been updated successfully, but the tenant notification email could not be
                    sent.
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center space-x-2">
                <span>Pending</span>
                {pendingBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center space-x-2">
                <span>Approved</span>
                {approvedBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {approvedBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center space-x-2">
                <span>Rejected</span>
                {rejectedBookings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {rejectedBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
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
              ) : pendingBookings.length > 0 ? (
                <div className="space-y-6">
                  {pendingBookings.map((booking: Booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-600">All inspection requests have been reviewed</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedBookings.length > 0 ? (
                <div className="space-y-6">
                  {approvedBookings.map((booking: Booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Approved Requests</h3>
                    <p className="text-gray-600">No inspection requests have been approved yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedBookings.length > 0 ? (
                <div className="space-y-6">
                  {rejectedBookings.map((booking: Booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rejected Requests</h3>
                    <p className="text-gray-600">No inspection requests have been rejected</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}