// "use client"

// import { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { useAppSelector, useAppDispatch } from "@/hooks/redux"
// import { loadUserFromStorage } from "@/store/slices/authSlice"
// import { Navbar } from "@/components/layout/navbar"
// import { Building2, Users, Shield, CheckCircle } from "lucide-react"

// export default function HomePage() {
//   const { user, token } = useAppSelector((state) => state.auth)
//   const dispatch = useAppDispatch()
//   const router = useRouter()

//   useEffect(() => {
//     dispatch(loadUserFromStorage())
//   }, [dispatch])

//   useEffect(() => {
//     if (token && user) {
//       const dashboardRoute = user.role === "admin" ? "/admin" : user.role === "landlord" ? "/landlord" : "/tenant"
//       router.push(dashboardRoute)
//     }
//   }, [token, user, router])

//   if (token && user) {
//     return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6">
//               Find Your Perfect
//               <span className="block text-blue-200">Rental Property</span>
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
//               Connect with trusted landlords and tenants. Secure, transparent, and hassle-free property rentals.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/register">
//                 <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
//                   Get Started
//                 </Button>
//               </Link>
//               <Link href="/properties">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
//                 >
//                   Browse Properties
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose RentEase?</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               We make property rental simple, secure, and transparent for everyone involved.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="text-center p-6">
//               <CardContent className="pt-6">
//                 <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Quality Properties</h3>
//                 <p className="text-gray-600">
//                   Verified properties with detailed information, photos, and transparent pricing.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="text-center p-6">
//               <CardContent className="pt-6">
//                 <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
//                 <p className="text-gray-600">
//                   Connect with verified landlords and tenants through our secure platform.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="text-center p-6">
//               <CardContent className="pt-6">
//                 <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
//                 <p className="text-gray-600">Safe and secure payment processing with dispute resolution support.</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="bg-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
//           </div>

//           <div className="grid md:grid-cols-2 gap-12">
//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">For Tenants</h3>
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">Browse Properties</h4>
//                     <p className="text-gray-600">Search and filter properties based on your preferences</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">Request Inspection</h4>
//                     <p className="text-gray-600">Schedule property visits with landlords</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">Secure Payment</h4>
//                     <p className="text-gray-600">Make payments safely through our platform</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-6">For Landlords</h3>
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">List Properties</h4>
//                     <p className="text-gray-600">Add your properties with photos and details</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">Manage Bookings</h4>
//                     <p className="text-gray-600">Review and approve tenant inspection requests</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
//                   <div>
//                     <h4 className="font-semibold">Receive Payments</h4>
//                     <p className="text-gray-600">Get paid securely and on time</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="flex items-center justify-center space-x-2 mb-4">
//               <Building2 className="h-8 w-8 text-blue-400" />
//               <span className="text-2xl font-bold">RentEase</span>
//             </div>
//             <p className="text-gray-400">Making property rental simple and secure</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { loadUserFromStorage } from "@/store/slices/authSlice"
import { Navbar } from "@/components/layout/navbar"
import { Building2, Users, Shield, CheckCircle } from "lucide-react"

export default function HomePage() {
  const { user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  useEffect(() => {
    if (token && user) {
      const dashboardRoute =
        user.role === "admin"
          ? "/admin"
          : user.role === "landlord"
          ? "/landlord"
          : "/tenant"
      router.push(dashboardRoute)
    }
  }, [token, user, router])

  if (token && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-blue-200">Rental Property</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with trusted landlords and tenants. Secure, transparent, and hassle-free property rentals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/properties">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg bg-transparent"
                >
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RentEase?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make property rental simple, secure, and transparent for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Properties</h3>
                <p className="text-gray-600">
                  Verified properties with detailed information, photos, and transparent pricing.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
                <p className="text-gray-600">
                  Connect with verified landlords and tenants through our secure platform.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Safe and secure payment processing with dispute resolution support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Tenants</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Browse Properties",
                    desc: "Search and filter properties based on your preferences",
                  },
                  {
                    title: "Request Inspection",
                    desc: "Schedule property visits with landlords",
                  },
                  {
                    title: "Secure Payment",
                    desc: "Make payments safely through our platform",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">{title}</h4>
                      <p className="text-gray-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Landlords</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "List Properties",
                    desc: "Add your properties with photos and details",
                  },
                  {
                    title: "Manage Bookings",
                    desc: "Review and approve tenant inspection requests",
                  },
                  {
                    title: "Receive Payments",
                    desc: "Get paid securely and on time",
                  },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-semibold">{title}</h4>
                      <p className="text-gray-600">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">RentEase</span>
            </div>
            <p className="text-gray-400">Making property rental simple and secure</p>
          </div>
        </div>
      </footer>
    </div>
  )
}