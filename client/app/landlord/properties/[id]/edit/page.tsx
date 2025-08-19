"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchPropertyById, updateProperty } from "@/store/slices/propertySlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { PropertyForm } from "@/components/property/property-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { currentProperty: property, isLoading } = useAppSelector((state) => state.property)
  const { user } = useAppSelector((state) => state.auth)
  const [formError, setFormError] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPropertyById(params.id as string))
    }
  }, [dispatch, params.id])

  const handleSubmit = async (formData: FormData) => {
    if (!property) return

    try {
      setFormError(null)
      await dispatch(updateProperty({ id: property._id, data: formData })).unwrap()
      router.push("/landlord/properties")
    } catch (error) {
      setFormError(error)
    }
  }

  // Check if user owns this property
  if (property && property.landlord._id !== user?._id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">You don't have permission to edit this property</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
            <p className="text-gray-600">Update your property details</p>
          </div>

          {property ? (
            <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} initialData={property} error={formError} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading property details...</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
