"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchProperties } from "@/store/slices/propertySlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PropertyCard } from "@/components/property/property-card"
import { Search, Calendar, MessageSquare, Star } from "lucide-react"

export default function TenantDashboard() {
  const dispatch = useAppDispatch()
  const { properties, isLoading } = useAppSelector((state) => state.property)

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const approvedProperties = (properties || []).filter(
    (property) => property.status === "approved" || property.approved === true,
  )

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Dashboard</h1>
            <p className="text-gray-600">Find and manage your rental properties</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Browse Properties</span>
                </CardTitle>
                <CardDescription>Find your perfect rental</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/properties">
                  <Button className="w-full">Search Properties</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </CardTitle>
                <CardDescription>View inspection requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tenant/bookings">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Bookings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Disputes</span>
                </CardTitle>
                <CardDescription>Manage disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tenant/disputes">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Disputes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Rate Landlords</span>
                </CardTitle>
                <CardDescription>Share your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tenant/ratings">
                  <Button variant="outline" className="w-full bg-transparent">
                    Rate & Review
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Featured Properties */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <Link href="/properties">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : approvedProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedProperties.slice(0, 6).map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Available</h3>
                  <p className="text-gray-600 mb-4">Check back later for new listings</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
