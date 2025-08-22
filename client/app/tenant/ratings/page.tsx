"use client"

import { useEffect, useState } from "react"
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

export default function TenantRatingsPage() {
  const dispatch = useAppDispatch()
  const { properties } = useAppSelector((state) => state.property)
  const { error } = useAppSelector((state) => state.rating)
  const { user } = useAppSelector((state) => state.auth)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const handleDeleteRating = async (ratingId: string) => {
    if (!confirm("Are you sure you want to delete this rating? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[v0] Deleting rating:", ratingId)
      await dispatch(deleteRating(ratingId)).unwrap()
      toast.success("Rating deleted successfully")
    } catch (error) {
      console.error("[v0] Failed to delete rating:", error)
      toast.error("Failed to delete rating")
    }
  }

  const landlords = (properties || []).reduce((acc: any[], property) => {
    console.log(`[v0] Processing property: ${property.title}, landlord:`, property.landlord)

    // Handle case where landlord is just a string ID
    if (typeof property.landlord === "string") {
      console.log(`[v0] Landlord is string ID: ${property.landlord}`)
      const existingLandlord = acc.find((l) => l._id === property.landlord)
      if (!existingLandlord) {
        acc.push({
          _id: property.landlord,
          name: "Landlord", // Fallback name
          email: "Not available",
          phone: "Not available",
          properties: [property],
        })
      } else {
        existingLandlord.properties.push(property)
      }
    }
    // Handle case where landlord is a User object
    else if (property.landlord && typeof property.landlord === "object" && property.landlord._id) {
      console.log(`[v0] Landlord is object:`, property.landlord)
      const existingLandlord = acc.find((l) => l._id === property.landlord._id)
      if (!existingLandlord) {
        acc.push({
          ...property.landlord,
          properties: [property],
        })
      } else {
        existingLandlord.properties.push(property)
      }
    }
    // Handle case where landlord is null - create placeholder landlord
    else if (property.landlord === null && property._id) {
      console.log(`[v0] Landlord is null, creating placeholder for property: ${property.title}`)
      const placeholderLandlordId = `placeholder-${property._id}`
      const existingLandlord = acc.find((l) => l._id === placeholderLandlordId)
      if (!existingLandlord) {
        acc.push({
          _id: placeholderLandlordId,
          name: "Unknown Landlord",
          email: "Information not available",
          phone: "Information not available",
          properties: [property],
          isPlaceholder: true,
        })
      } else {
        existingLandlord.properties.push(property)
      }
    }
    return acc
  }, [])

  useEffect(() => {
    console.log("[v0] Final landlords array:", landlords)
    console.log("[v0] Number of landlords:", landlords.length)
    landlords.forEach((landlord, index) => {
      console.log(`[v0] Landlord ${index + 1}:`, {
        id: landlord._id,
        name: landlord.name,
        email: landlord.email,
        isPlaceholder: landlord.isPlaceholder,
        propertiesCount: landlord.properties.length,
      })
    })
  }, [landlords])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Landlords</h1>
              <p className="text-gray-600">Rate landlords based on your rental experience</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Rating</span>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Available Landlords to Rate */}
          {landlords.length > 0 ? (
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
                    <div key={landlord._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span className="font-medium">{landlord.name}</span>
                          {landlord.isPlaceholder && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Info Unavailable
                            </span>
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
                        <p className="text-sm text-gray-600">{landlord.email}</p>
                        <div className="space-y-1">
                          {landlord.properties.map((property: any) => (
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

// "use client"

// import { useEffect, useState } from "react"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { fetchProperties } from "@/store/slices/propertySlice"
// import { deleteRating } from "@/store/slices/ratingSlice"
// import { AuthGuard } from "@/components/auth/auth-guard"
// import { Navbar } from "@/components/layout/navbar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { CreateRatingDialog } from "@/components/rating/create-rating-dialog"
// import { Star, Plus, User, Building2 } from "lucide-react"
// import { toast } from "sonner"

// export default function TenantRatingsPage() {
//   const dispatch = useAppDispatch()
//   const { properties } = useAppSelector((state) => state.property)
//   const { error } = useAppSelector((state) => state.rating)
//   const [showCreateDialog, setShowCreateDialog] = useState(false)

//   useEffect(() => {
//     dispatch(fetchProperties())
//   }, [dispatch])

//   const handleDeleteRating = async (ratingId: string) => {
//     if (!confirm("Are you sure you want to delete this rating? This action cannot be undone.")) return

//     try {
//       await dispatch(deleteRating(ratingId)).unwrap()
//       toast.success("Rating deleted successfully")
//     } catch (err) {
//       console.error("Failed to delete rating:", err)
//       toast.error("Failed to delete rating")
//     }
//   }

//   // Organize landlords from properties
//   const landlords = (properties || []).reduce((acc: any[], property) => {
//     let landlordData

//     if (typeof property.landlord === "string") {
//       landlordData = { _id: property.landlord, name: "Landlord", email: "Not available", phone: "Not available" }
//     } else if (property.landlord && typeof property.landlord === "object" && property.landlord._id) {
//       landlordData = { ...property.landlord }
//     } else {
//       // Placeholder for null landlord
//       landlordData = {
//         _id: `placeholder-${property._id}`,
//         name: "Unknown Landlord",
//         email: "Information not available",
//         phone: "Information not available",
//         isPlaceholder: true,
//       }
//     }

//     const existing = acc.find((l) => l._id === landlordData._id)
//     if (existing) {
//       existing.properties.push(property)
//     } else {
//       acc.push({ ...landlordData, properties: [property] })
//     }

//     return acc
//   }, [])

//   const renderStars = (rating: number) =>
//     Array.from({ length: 5 }, (_, i) => (
//       <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
//     ))

//   return (
//     <AuthGuard allowedRoles={["tenant"]}>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate Landlords</h1>
//               <p className="text-gray-600">Rate landlords based on your rental experience</p>
//             </div>
//             <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
//               <Plus className="h-4 w-4" />
//               <span>Add Rating</span>
//             </Button>
//           </div>

//           {/* Error Alert */}
//           {error && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {/* Landlords List */}
//           {landlords.length > 0 ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <Building2 className="h-5 w-5" />
//                   <span>Available Landlords to Rate</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {landlords.map((landlord) => (
//                     <div key={landlord._id} className="p-4 border rounded-lg">
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center space-x-2">
//                           <User className="h-5 w-5" />
//                           <span className="font-medium">{landlord.name}</span>
//                           {landlord.isPlaceholder && (
//                             <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
//                               Info Unavailable
//                             </span>
//                           )}
//                         </div>
//                         <Button
//                           onClick={() => setShowCreateDialog(true)}
//                           size="sm"
//                           className="flex items-center space-x-2"
//                           disabled={landlord.isPlaceholder}
//                         >
//                           <Star className="h-4 w-4" />
//                           <span>{landlord.isPlaceholder ? "Cannot Rate" : "Rate Landlord"}</span>
//                         </Button>
//                       </div>

//                       <div className="space-y-2">
//                         <p className="text-sm text-gray-600">{landlord.email}</p>
//                         <div className="space-y-1">
//                           {landlord.properties.map((property: any) => (
//                             <div
//                               key={property._id}
//                               className="flex items-center space-x-2 text-sm text-gray-600"
//                             >
//                               <Building2 className="h-3 w-3" />
//                               <span>{property.title}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardContent className="text-center py-12">
//                 <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Landlords to Rate</h3>
//                 <p className="text-gray-600">Browse properties to find landlords you can rate</p>
//               </CardContent>
//             </Card>
//           )}

//           <CreateRatingDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} landlords={landlords} />
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }