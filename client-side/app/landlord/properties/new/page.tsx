"use client"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { createProperty } from "@/store/slices/propertySlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { PropertyForm } from "@/components/property/property-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function NewPropertyPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.property)
  const [formError, setFormError] = useState<any>(null)

  const handleSubmit = async (formData: FormData) => {
    try {
      setFormError(null)

      console.log("Submitting property data:")
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      await dispatch(createProperty(formData)).unwrap()
      router.push("/landlord/properties")
    } catch (error) {
      console.error("Property creation failed:", error)
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        violations: error?.violations,
      })
      setFormError(error)
    }
  }

  return (
    <AuthGuard allowedRoles={["landlord"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
            <p className="text-gray-600">Fill in the details to list your property for rent</p>
          </div>

          <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} error={formError} />
        </div>
      </div>
    </AuthGuard>
  )
}
