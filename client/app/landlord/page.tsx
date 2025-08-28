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
import { Building2, Plus, Eye, Calendar, DollarSign } from "lucide-react"
import { Property } from "@/types"
import SuspendedPage from "@/app/suspended/page"; // ✅ import the suspended page

export default function LandlordDashboard() {
  const dispatch = useAppDispatch()
  const { properties, isLoading } = useAppSelector((state) => state.property)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const myProperties = (properties || []).filter((property: Property) => {
    const landlordId = typeof property.landlord === "string" ? property.landlord : property.landlord?._id
    return landlordId === user?._id
  })

  const approvedProperties = myProperties.filter(
    (property: Property) => property.status === "approved" || property.approved === true,
  )
  const pendingProperties = myProperties.filter(
    (property: Property) => property.status === "pending" || property.approved === false,
  )
  const totalRentValue = myProperties.reduce((sum: number, property: Property) => sum + property.rentAmount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // 🚨 Block suspended landlords
  if (user?.status === "suspended") {
    return <SuspendedPage />
  }

  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Landlord Dashboard</h1>
            <p className="text-gray-600">Manage your properties and bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myProperties.length}</div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{approvedProperties.length}</div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingProperties.length}</div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rent Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalRentValue)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Add New Property</CardTitle>
                <CardDescription>List a new property for rent</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/landlord/properties/new">
                  <Button className="w-full flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Property</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Manage Properties</CardTitle>
                <CardDescription>View and edit your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/landlord/properties">
                  <Button variant="outline" className="w-full flex items-center space-x-2 bg-transparent">
                    <Building2 className="h-4 w-4" />
                    <span>View Properties</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>Review inspection requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/landlord/bookings">
                  <Button variant="outline" className="w-full flex items-center space-x-2 bg-transparent">
                    <Calendar className="h-4 w-4" />
                    <span>View Bookings</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Properties */}
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Properties</h2>
              <Link href="/landlord/properties">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse w-full">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : myProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {myProperties.slice(0, 6).map((property: Property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            ) : (
              <Card className="w-full">
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first property</p>
                  <Link href="/landlord/properties/new">
                    <Button>Add Property</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}