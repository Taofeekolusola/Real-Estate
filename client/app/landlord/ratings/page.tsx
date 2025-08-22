// "use client"

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { fetchLandlordRatings } from "@/store/slices/ratingSlice"
// import { AuthGuard } from "@/components/auth/auth-guard"
// import { Navbar } from "@/components/layout/navbar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Star, User, MessageSquare } from "lucide-react"

// export default function LandlordRatingsPage() {
//   const dispatch = useAppDispatch()
//   const { landlordRatings, isLoading, error } = useAppSelector((state) => state.rating)
//   const { user } = useAppSelector((state) => state.auth)

//   useEffect(() => {
//     if (user) {
//       dispatch(fetchLandlordRatings(user._id))
//     }
//   }, [dispatch, user])

//   const ratingsArray = landlordRatings || []

//   const averageRating =
//     ratingsArray.length > 0 ? ratingsArray.reduce((sum, rating) => sum + rating.rating, 0) / ratingsArray.length : 0

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex space-x-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
//         ))}
//       </div>
//     )
//   }

//   return (
//     <AuthGuard allowedRoles={["landlord"]}>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />

//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">My Ratings</h1>
//             <p className="text-gray-600">See what tenants are saying about you</p>
//           </div>

//           {/* Rating Summary */}
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Rating Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
//                   <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
//                   <p className="text-sm text-gray-600">Average Rating</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-green-600 mb-2">{ratingsArray.length}</div>
//                   <p className="text-sm text-gray-600">Total Reviews</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-purple-600 mb-2">
//                     {ratingsArray.filter((r) => r.rating >= 4).length}
//                   </div>
//                   <p className="text-sm text-gray-600">4+ Star Reviews</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {error && (
//             <Alert variant="destructive" className="mb-6">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {isLoading ? (
//             <div className="space-y-4">
//               {[...Array(3)].map((_, i) => (
//                 <Card key={i} className="animate-pulse">
//                   <CardContent className="p-6">
//                     <div className="h-4 bg-gray-200 rounded mb-2"></div>
//                     <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
//                     <div className="h-20 bg-gray-200 rounded"></div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : ratingsArray.length > 0 ? (
//             <div className="space-y-6">
//               {ratingsArray.map((rating) => (
//                 <Card key={rating._id}>
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-3">
//                         <User className="h-8 w-8 text-gray-400" />
//                         <div>
//                           <p className="font-semibold">{rating.tenant.name}</p>
//                           <div className="flex items-center space-x-2">
//                             {renderStars(rating.rating)}
//                             <span className="text-sm text-gray-500">({rating.rating}/5)</span>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500">{formatDate(rating.createdAt)}</p>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-start space-x-2">
//                       <MessageSquare className="h-4 w-4 mt-1 text-gray-500" />
//                       <p className="text-gray-600">{rating.comment}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <Card>
//               <CardContent className="text-center py-12">
//                 <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ratings Yet</h3>
//                 <p className="text-gray-600">You haven't received any ratings from tenants yet</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }

"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchLandlordRatings } from "@/store/slices/ratingSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, User, MessageSquare } from "lucide-react"

export default function LandlordRatingsPage() {
  const dispatch = useAppDispatch()
  const { landlordRatings, isLoading, error } = useAppSelector((state) => state.rating)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      dispatch(fetchLandlordRatings(user._id))
    }
  }, [dispatch, user])

  const ratingsArray = landlordRatings || []

  const averageRating =
    ratingsArray.length > 0
      ? ratingsArray.reduce((sum, rating) => sum + rating.rating, 0) / ratingsArray.length
      : 0

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  )

  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Ratings</h1>
            <p className="text-gray-600">See what tenants are saying about you</p>
          </div>

          {/* Rating Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rating Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{ratingsArray.length}</div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {ratingsArray.filter((r) => r.rating >= 4).length}
                  </div>
                  <p className="text-sm text-gray-600">4+ Star Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ratings List */}
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
          ) : ratingsArray.length > 0 ? (
            <div className="space-y-6">
              {ratingsArray.map((rating) => (
                <Card key={rating._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-semibold">{rating.tenant.name}</p>
                          <div className="flex items-center space-x-2">
                            {renderStars(rating.rating)}
                            <span className="text-sm text-gray-500">({rating.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(rating.createdAt)}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-gray-500" />
                      <p className="text-gray-600">{rating.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ratings Yet</h3>
                <p className="text-gray-600">You haven't received any ratings from tenants yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}