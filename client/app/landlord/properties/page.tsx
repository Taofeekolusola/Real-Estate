// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { fetchProperties, deleteProperty } from "@/store/slices/propertySlice"
// import { AuthGuard } from "@/components/auth/auth-guard"
// import { Navbar } from "@/components/layout/navbar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Plus, Edit, Trash2, MapPin, DollarSign, Calendar } from "lucide-react"

// export default function LandlordPropertiesPage() {
//   const dispatch = useAppDispatch()
//   const { properties, isLoading } = useAppSelector((state) => state.property)
//   const { user } = useAppSelector((state) => state.auth)
//   const [deleteError, setDeleteError] = useState("")

//   useEffect(() => {
//     console.log("Fetching properties...")
//     dispatch(fetchProperties())
//   }, [dispatch])

//   console.log("=== DEBUGGING PROPERTY DISPLAY ===")
//   console.log("All properties from Redux:", properties)
//   console.log("Properties count:", properties?.length)
//   console.log("Current user:", user)
//   console.log("User ID:", user?._id)

//   const myProperties = (properties || []).filter((property) => {
//     console.log("--- Checking property ---")
//     console.log("Property ID:", property._id)
//     console.log("Property title:", property.title)
//     console.log("Property landlord field:", property.landlord)
//     console.log("Property landlord type:", typeof property.landlord)

//     // Handle different possible structures for the landlord field
//     const landlordId = typeof property.landlord === "string" ? property.landlord : property.landlord?._id
//     console.log("Extracted landlord ID:", landlordId)
//     console.log("User ID for comparison:", user?._id)
//     console.log("IDs match:", landlordId === user?._id)
//     console.log("Property approved:", property.approved)
//     console.log("Property status:", property.status)

//     const isMatch = landlordId === user?._id
//     console.log("Will include this property:", isMatch)

//     return isMatch
//   })

//   console.log("Filtered my properties:", myProperties)
//   console.log("My properties count:", myProperties.length)

//   const handleDeleteProperty = async (propertyId: string) => {
//     try {
//       await dispatch(deleteProperty(propertyId)).unwrap()
//       setDeleteError("")
//     } catch (error: any) {
//       setDeleteError(error || "Failed to delete property")
//     }
//   }

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//     }).format(amount)
//   }

//   return (
//     <AuthGuard allowedRoles={["landlord"]}>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
//               <p className="text-gray-600">Manage your rental properties ({myProperties.length} properties)</p>
//             </div>
//             <Link href="/landlord/properties/new">
//               <Button className="flex items-center space-x-2">
//                 <Plus className="h-4 w-4" />
//                 <span>Add Property</span>
//               </Button>
//             </Link>
//           </div>

//           <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
//             <p className="text-sm text-yellow-700">Total properties fetched: {properties?.length || 0}</p>
//             <p className="text-sm text-yellow-700">My properties: {myProperties.length}</p>
//             <p className="text-sm text-yellow-700">User ID: {user?._id}</p>
//             <p className="text-sm text-yellow-700">Check browser console for detailed logs</p>
//           </div>

//           {deleteError && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertDescription>{deleteError}</AlertDescription>
//             </Alert>
//           )}

//           {isLoading ? (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
//                   <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//                 </div>
//               ))}
//             </div>
//           ) : myProperties.length > 0 ? (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {myProperties.map((property) => (
//                 <Card key={property._id} className="overflow-hidden">
//                   <div className="relative h-48 bg-gray-200">
//                     {property.images && property.images.length > 0 ? (
//                       <img
//                         src={property.images[0] || "/placeholder.svg"}
//                         alt={property.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400">
//                         <span>No Image</span>
//                       </div>
//                     )}
//                     <div className="absolute top-2 right-2">
//                       <Badge variant={property.status === "approved" ? "default" : "secondary"}>
//                         {property.status}
//                       </Badge>
//                     </div>
//                   </div>

//                   <CardContent className="p-4">
//                     <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

//                     <div className="flex items-center text-gray-600 mb-2">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       <span className="text-sm line-clamp-1">{property.address}</span>
//                     </div>

//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center text-green-600 font-semibold">
//                         <DollarSign className="h-4 w-4 mr-1" />
//                         <span>{formatCurrency(property.rentAmount)}</span>
//                       </div>
//                       <div className="flex items-center text-gray-600 text-sm">
//                         <Calendar className="h-4 w-4 mr-1" />
//                         <span>{property.durationInMonths} months</span>
//                       </div>
//                     </div>

//                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

//                     <div className="flex space-x-2">
//                       <Link href={`/properties/${property._id}`} className="flex-1">
//                         <Button variant="outline" size="sm" className="w-full bg-transparent">
//                           View
//                         </Button>
//                       </Link>
//                       <Link href={`/landlord/properties/${property._id}/edit`}>
//                         <Button variant="outline" size="sm">
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                       </Link>
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="text-red-600 hover:text-red-700 bg-transparent"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>Delete Property</AlertDialogTitle>
//                             <AlertDialogDescription>
//                               Are you sure you want to delete "{property.title}"? This action cannot be undone.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Cancel</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => handleDeleteProperty(property._id)}
//                               className="bg-red-600 hover:bg-red-700"
//                             >
//                               Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <Card>
//               <CardContent className="text-center py-12">
//                 <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
//                 <p className="text-gray-600 mb-4">Start by adding your first property</p>
//                 <Link href="/landlord/properties/new">
//                   <Button>Add Property</Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchProperties, deleteProperty } from "@/store/slices/propertySlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Plus, Edit, Trash2, MapPin, DollarSign, Calendar } from "lucide-react"

export default function LandlordPropertiesPage() {
  const dispatch = useAppDispatch()
  const { properties, isLoading } = useAppSelector((state) => state.property)
  const { user } = useAppSelector((state) => state.auth)
  const [deleteError, setDeleteError] = useState<string>("")

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const myProperties = (properties || []).filter((property) => {
    const landlordId = typeof property.landlord === "string" ? property.landlord : property.landlord?._id
    return landlordId === user?._id
  })

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await dispatch(deleteProperty(propertyId)).unwrap()
      setDeleteError("")
    } catch (error: any) {
      setDeleteError(error?.message || "Failed to delete property")
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount)

  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
              <p className="text-gray-600">Manage your rental properties ({myProperties.length} properties)</p>
            </div>
            <Link href="/landlord/properties/new">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Property</span>
              </Button>
            </Link>
          </div>

          {/* Delete Error Alert */}
          {deleteError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {/* Properties List */}
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
          ) : myProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <Card key={property._id} className="overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={property.status === "approved" ? "default" : "secondary"}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm line-clamp-1">{property.address}</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{formatCurrency(property.rentAmount)}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{property.durationInMonths} months</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link href={`/properties/${property._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          View
                        </Button>
                      </Link>
                      <Link href={`/landlord/properties/${property._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{property.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProperty(property._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
    </AuthGuard>
  )
}
