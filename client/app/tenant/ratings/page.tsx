"use client"

import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchProperties } from "@/store/slices/propertySlice"
import { deleteRating } from "@/store/slices/ratingSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreateRatingDialog } from "@/components/rating/create-rating-dialog"
import { Star, Plus, User, Building2 } from "lucide-react"
import { toast } from "sonner"
import { Property, User as Users } from "@/types"

interface LandlordUI extends Users {
  isPlaceholder?: boolean
  properties: Property[]
}

export default function TenantRatingsPage() {
  const dispatch = useAppDispatch()
  const { properties, isLoading } = useAppSelector((state) => state.property)
  const { error } = useAppSelector((state) => state.rating)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const landlords: LandlordUI[] = useMemo(() => {
    return (properties || []).reduce((acc: LandlordUI[], property: Property) => {
      let landlordData: LandlordUI

      if (typeof property.landlord === "string") {
        landlordData = {
          _id: property.landlord,
          name: "Landlord",
          email: "Not available",
          phone: "Not available",
          properties: [],
        }
      } else if (property.landlord && typeof property.landlord === "object" && property.landlord._id) {
        landlordData = { ...property.landlord, properties: [] }
      } else {
        landlordData = {
          _id: `placeholder-${property._id}`,
          name: "Unknown Landlord",
          email: "Information not available",
          phone: "Information not available",
          isPlaceholder: true,
          properties: [],
        }
      }

      const existing = acc.find((l) => l._id === landlordData._id)
      if (existing) {
        existing.properties.push(property)
      } else {
        acc.push({ ...landlordData, properties: [property] })
      }
      return acc
    }, [])
  }, [properties])

  const handleDeleteRating = async (ratingId: string) => {
    if (!confirm("Are you sure you want to delete this rating?")) return
    try {
      await dispatch(deleteRating(ratingId)).unwrap()
      toast.success("Rating deleted successfully")
    } catch {
      toast.error("Failed to delete rating")
    }
  }

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Landlords</h1>
              <p className="text-gray-600">Rate landlords based on your rental experience</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2 self-start md:self-auto">
              <Plus className="h-4 w-4" />
              <span>Add Rating</span>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse bg-white">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : landlords.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Available Landlords to Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {landlords.map((landlord) => (
                    <div key={landlord._id} className="p-4 border rounded-lg bg-white">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span className="font-medium">{landlord.name}</span>
                          {landlord.isPlaceholder && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Info Unavailable</span>
                          )}
                        </div>
                        <Button
                          onClick={() => setShowCreateDialog(true)}
                          size="sm"
                          className="flex items-center space-x-2"
                          disabled={landlord.isPlaceholder}
                        >
                          <Star className="h-4 w-4" />
                          <span>{landlord.isPlaceholder ? "Cannot Rate" : "Rate Landlord"}</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 break-words">{landlord.email}</p>
                        <div className="space-y-1">
                          {landlord.properties.map((property) => (
                            <div key={property._id} className="flex items-center space-x-2 text-sm text-gray-600">
                              <Building2 className="h-3 w-3" />
                              <span>{property.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Landlords to Rate</h3>
                <p className="text-gray-600">Browse properties to find landlords you can rate</p>
              </CardContent>
            </Card>
          )}

          <CreateRatingDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} landlords={landlords} />
        </div>
      </div>
    </AuthGuard>
  )
}