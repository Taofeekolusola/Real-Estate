"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchAllProperties, approveProperty } from "@/store/slices/adminSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Building, Check, Clock, X } from "lucide-react"
import { toast } from "sonner"
// import { Property as IProperty } from "@/types"

export default function AdminProperties() {
  const dispatch = useAppDispatch()
  const { properties, isLoading } = useAppSelector((state) => state.admin)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchAllProperties())
  }, [dispatch])

  const handleApproveProperty = async (propertyId: string) => {
    try {
      await dispatch(approveProperty(propertyId)).unwrap()
      toast.success("Property approved successfully")
    } catch {
      toast.error("Failed to approve property")
    }
  }

  const filteredProperties = (properties || []).filter((property) => {
    const title = property.title || ""
    const address = property.address || ""
    const landlordName =
      typeof property.landlord === "object" ? property.landlord?.name || "" : ""

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlordName.toLowerCase().includes(searchTerm.toLowerCase())

    const propertyStatus = property.status || (property.approved ? "approved" : "pending")
    const matchesStatus = statusFilter === "all" || propertyStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: typeof Clock; text: string }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" },
      approved: { color: "bg-green-100 text-green-800", icon: Check, text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", icon: X, text: "Rejected" },
    }

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: Clock,
      text: status || "Unknown",
    }

    const Icon = config.icon
    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Management</h1>
            <p className="text-gray-600">Review and approve property listings</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search & Filter Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, address, or landlord..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Properties List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Properties ({filteredProperties.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : filteredProperties.length > 0 ? (
                <div className="space-y-4">
                  {filteredProperties.map((property) => (
                    <div
                      key={property._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{property.title}</h3>
                            {getStatusBadge(property.status || (property.approved ? "approved" : "pending"))}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{property.address}</p>
                          <p className="text-sm text-gray-500">
                            Landlord:{" "}
                            {typeof property.landlord === "object"
                              ? `${property.landlord?.name || "Unknown"} (${property.landlord?.email || "No email"})`
                              : "Landlord ID: " + property.landlord}
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            ₦{property.rentAmount.toLocaleString()}/month
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {(property.status === "pending" || (!property.status && !property.approved)) && (
                          <Button
                            onClick={() => handleApproveProperty(property._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
                  <p className="text-gray-600">No properties match your current filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}