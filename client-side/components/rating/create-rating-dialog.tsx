"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { createRating } from "@/store/slices/ratingSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, CheckCircle } from "lucide-react"

interface CreateRatingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  landlords: any[]
}

export function CreateRatingDialog({ open, onOpenChange, landlords }: CreateRatingDialogProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.rating)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    landlord: "",
    rating: 0,
    comment: "",
  })

  const availableLandlords = landlords.filter((landlord) => {
    // If it's a real landlord (not placeholder), include it
    if (!landlord.isPlaceholder) {
      return true
    }

    // For placeholder landlords, check if any of their properties are available
    return landlord.properties && landlord.properties.some((property: any) => property.available === true)
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedLandlord = availableLandlords.find((l) => l._id === formData.landlord)
    if (!selectedLandlord) {
      return
    }

    try {
      const landlordId = selectedLandlord.isPlaceholder ? selectedLandlord.properties[0]._id : formData.landlord

      console.log("[v0] Rating submission data:")
      console.log("[v0] Selected landlord:", selectedLandlord)
      console.log("[v0] Form data:", formData)
      console.log("[v0] Landlord ID being sent:", landlordId)
      console.log("[v0] Is placeholder:", selectedLandlord.isPlaceholder)
      console.log("[v0] Rating data being sent:", {
        landlord: landlordId,
        rating: formData.rating,
        comment: formData.comment,
      })

      await dispatch(
        createRating({
          landlord: landlordId,
          rating: formData.rating,
          comment: formData.comment,
        }),
      ).unwrap()

      console.log("[v0] Rating submitted successfully")
      setSuccess(true)
      setFormData({ landlord: "", rating: 0, comment: "" })

      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error("[v0] Rating submission failed:", error)
      console.error("[v0] Error type:", typeof error)
      console.error("[v0] Error details:", JSON.stringify(error, null, 2))
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSuccess(false)
    }
    onOpenChange(open)
  }

  const selectedLandlord = availableLandlords.find((l) => l._id === formData.landlord)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate Landlord</DialogTitle>
          <DialogDescription>Share your experience and help other tenants make informed decisions.</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700">Rating Submitted Successfully!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Thank you for sharing your experience. Your rating will help other tenants make informed decisions.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {availableLandlords.length === 0 && (
              <Alert>
                <AlertDescription>
                  No landlords are available to rate at this time. Landlord information may not be properly loaded for
                  your properties.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="landlord">Property/Landlord *</Label>
              <Select value={formData.landlord} onValueChange={(value) => handleChange("landlord", value)}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      availableLandlords.length === 0 ? "No properties available" : "Select a property to rate"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableLandlords.map((landlord) => (
                    <SelectItem key={landlord._id} value={landlord._id}>
                      {landlord.isPlaceholder
                        ? `${landlord.properties[0]?.title || "Property"} - ${landlord.properties[0]?.address || "Unknown Address"}`
                        : `${landlord.email || landlord.name || "Landlord"} (${landlord.propertiesCount || 0} properties)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLandlord && selectedLandlord.isPlaceholder && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                  <p>
                    <strong>Property:</strong> {selectedLandlord.properties[0]?.title}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedLandlord.properties[0]?.address}
                  </p>
                  <p className="text-xs mt-1">
                    Note: Landlord information is not available, but you can still rate your experience with this
                    property.
                  </p>
                </div>
              )}
              {selectedLandlord && !selectedLandlord.isPlaceholder && (
                <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                  <p>
                    <strong>Landlord:</strong> {selectedLandlord.email}
                  </p>
                  <p>
                    <strong>Properties:</strong> {selectedLandlord.propertiesCount} available
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleChange("rating", star)}
                    className={`p-1 rounded ${
                      star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {formData.rating === 0 && "Click to rate"}
                {formData.rating === 1 && "Poor"}
                {formData.rating === 2 && "Fair"}
                {formData.rating === 3 && "Good"}
                {formData.rating === 4 && "Very Good"}
                {formData.rating === 5 && "Excellent"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this landlord..."
                value={formData.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  availableLandlords.length === 0 ||
                  !formData.landlord ||
                  formData.rating === 0 ||
                  !formData.comment.trim()
                }
              >
                {isLoading ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
