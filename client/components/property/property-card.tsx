// "use client"

// import Link from "next/link"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import type { Property } from "@/types"
// import { MapPin, Calendar, DollarSign, User } from "lucide-react"

// interface PropertyCardProps {
//   property: Property
// }

// export function PropertyCard({ property }: PropertyCardProps) {
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//     }).format(amount)
//   }

//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="relative h-48 bg-gray-200">
//         {property.images && property.images.length > 0 ? (
//           <img
//             src={property.images[0] || "/placeholder.svg"}
//             alt={property.title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             <span>No Image</span>
//           </div>
//         )}
//         <div className="absolute top-2 right-2">
//           <Badge variant={property.status === "approved" ? "default" : "secondary"}>{property.status}</Badge>
//         </div>
//       </div>

//       <CardContent className="p-4">
//         <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

//         <div className="flex items-center text-gray-600 mb-2">
//           <MapPin className="h-4 w-4 mr-1" />
//           <span className="text-sm line-clamp-1">{property.address}</span>
//         </div>

//         <div className="flex items-center text-gray-600 mb-2">
//           <User className="h-4 w-4 mr-1" />
//           <span className="text-sm">
//             {typeof property.landlord === "string" ? "Landlord" : property.landlord?.name || "Unknown Landlord"}
//           </span>
//         </div>

//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center text-green-600 font-semibold">
//             <DollarSign className="h-4 w-4 mr-1" />
//             <span>{formatCurrency(property.rentAmount)}</span>
//           </div>
//           <div className="flex items-center text-gray-600 text-sm">
//             <Calendar className="h-4 w-4 mr-1" />
//             <span>{property.durationInMonths} months</span>
//           </div>
//         </div>

//         <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

//         <Link href={`/properties/${property._id}`}>
//           <Button className="w-full">View Details</Button>
//         </Link>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Property } from "@/types"
import { MapPin, Calendar, DollarSign, User } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-48 bg-gray-200">
        {property.images?.length ? (
          <img
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant={property.status === "approved" ? "default" : "secondary"}>
            {property.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold">{property.title}</h3>

        <div className="mb-2 flex items-center text-gray-600">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1 text-sm">{property.address}</span>
        </div>

        <div className="mb-2 flex items-center text-gray-600">
          <User className="mr-1 h-4 w-4" />
          <span className="text-sm">
            {typeof property.landlord === "string"
              ? "Landlord"
              : property.landlord?.name || "Unknown Landlord"}
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center font-semibold text-green-600">
            <DollarSign className="mr-1 h-4 w-4" />
            <span>{formatCurrency(property.rentAmount)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{property.durationInMonths} months</span>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{property.description}</p>

        <Link href={`/properties/${property._id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  )
}