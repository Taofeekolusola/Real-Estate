"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchPropertyById } from "@/store/slices/propertySlice"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import api from "@/lib/api"
import { MapPin, Calendar, DollarSign, User, Phone, Mail, FileText, ArrowLeft, MessageSquare } from "lucide-react"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProperty: property, isLoading } = useAppSelector((state) => state.property)
  const { user } = useAppSelector((state) => state.auth)
  const [bookingMessage, setBookingMessage] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPropertyById(params.id as string))
    }
  }, [dispatch, params.id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const handleBookingRequest = async () => {
    if (!user || !property) return

    setIsBooking(true)
    setBookingError("")

    try {
      await api.post("/booking/request", {
        propertyId: property._id,
        message: bookingMessage,
      })
      setBookingSuccess(true)
      setBookingMessage("")
    } catch (error: any) {
      setBookingError(error.response?.data?.message || "Failed to request inspection")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">Property not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        {/* Property Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {property.images && property.images.length > 0 ? (
            property.images.map((image: string, index: number) => (
              <div key={index} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              No Images Available
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <Badge variant={property.status === "approved" ? "default" : "secondary"}>{property.status}</Badge>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Rent Amount</p>
                    <p className="font-semibold text-green-600">{formatCurrency(property.rentAmount)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{property.durationInMonths} months</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Agency Fee</p>
                    <p className="font-semibold">{formatCurrency(property.agencyFee ?? 0)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    if (!property.paymentOptions) return null

                    // If it's already an array, use it directly
                    if (Array.isArray(property.paymentOptions)) {
                      return property.paymentOptions.map((option: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {option}
                        </Badge>
                      ))
                    }

                    // If it's a string, treat it as a single option
                    if (typeof property.paymentOptions === "string") {
                      return <Badge variant="outline">{property.paymentOptions}</Badge>
                    }

                    return null
                  })()}
                </div>
              </div>

              {property.legalFee !== undefined && property.legalFee > 0 && (
                <p className="text-gray-600">
                  Legal Fee: {formatCurrency(property.legalFee)}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Landlord</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {typeof property.landlord === "object" && property.landlord ? (
                    <>
                      <p className="font-semibold">{property.landlord.name}</p>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{property.landlord.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{property.landlord.phone}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="font-semibold">Landlord Information</p>
                      <p className="text-sm">Contact details available after booking</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Request */}
            {user && user.role === "tenant" && (property.status === "approved" || property.approved === true) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Request Inspection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingSuccess ? (
                    <Alert>
                      <AlertDescription>
                        Your inspection request has been sent successfully! The landlord will contact you soon.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {bookingError && (
                        <Alert variant="destructive">
                          <AlertDescription>{bookingError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="message">Message to Landlord</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell the landlord when you'd like to inspect the property..."
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button
                        onClick={handleBookingRequest}
                        disabled={isBooking || !bookingMessage.trim()}
                        className="w-full"
                      >
                        {isBooking ? "Sending Request..." : "Request Inspection"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-600 mb-4">Sign in to request property inspection</p>
                  <Button onClick={() => router.push("/login")} className="w-full">
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}