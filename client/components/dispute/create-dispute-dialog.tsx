// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { createDispute } from "@/store/slices/disputeSlice"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import type { Property } from "@/types"

// interface CreateDisputeDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   properties: Property[]
// }

// export function CreateDisputeDialog({ open, onOpenChange, properties }: CreateDisputeDialogProps) {
//   const dispatch = useAppDispatch()
//   const { isLoading, error } = useAppSelector((state) => state.dispute)
//   const [formData, setFormData] = useState({
//     property: "",
//     description: "",
//   })

//   const selectedProperty = (properties || []).find((p) => p._id === formData.property)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!selectedProperty) return

//     if (!selectedProperty.landlord) {
//       console.error("Cannot create dispute: landlord information is missing")
//       return
//     }

//     try {
//       await dispatch(
//         createDispute({
//           againstUser: selectedProperty.landlord._id,
//           property: formData.property,
//           description: formData.description,
//         }),
//       ).unwrap()

//       setFormData({ property: "", description: "" })
//       onOpenChange(false)
//     } catch (error) {
//       // Error is handled by Redux
//     }
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Create Dispute</DialogTitle>
//           <DialogDescription>
//             File a dispute against a landlord regarding a property issue. Please provide detailed information.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="property">Property *</Label>
//             <Select value={formData.property} onValueChange={(value) => handleChange("property", value)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select a property" />
//               </SelectTrigger>
//               <SelectContent>
//                 {(properties || []).map((property) => (
//                   <SelectItem key={property._id} value={property._id}>
//                     {property.title} - {property.address}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedProperty && (
//             <div className="bg-gray-50 rounded-lg p-3">
//               <p className="text-sm font-medium text-gray-700">Dispute against:</p>
//               <p className="text-sm text-gray-600">{selectedProperty.landlord?.name || "Unknown Landlord"}</p>
//             </div>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe the issue in detail..."
//               value={formData.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               rows={4}
//               required
//             />
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading || !formData.property || !formData.description.trim()}>
//               {isLoading ? "Creating..." : "Create Dispute"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import type React from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { createDispute } from "@/store/slices/disputeSlice"
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
import type { Property } from "@/types"

interface CreateDisputeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  properties: Property[]
}

export function CreateDisputeDialog({ open, onOpenChange, properties }: CreateDisputeDialogProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.dispute)
  const [formData, setFormData] = useState<{ property: string; description: string }>({
    property: "",
    description: "",
  })

  const selectedProperty = properties.find((p) => p._id === formData.property)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedProperty || !selectedProperty.landlord) {
      console.error("Cannot create dispute: property or landlord information is missing")
      return
    }

    try {
      await dispatch(
        createDispute({
          againstUser: selectedProperty.landlord._id,
          property: formData.property,
          description: formData.description.trim(),
        }),
      ).unwrap()

      setFormData({ property: "", description: "" })
      onOpenChange(false)
    } catch {
      // Error handled via Redux state
    }
  }

  const handleChange = (field: "property" | "description", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Dispute</DialogTitle>
          <DialogDescription>
            File a dispute against a landlord regarding a property issue. Please provide detailed information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="property">Property *</Label>
            <Select value={formData.property} onValueChange={(value) => handleChange("property", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property._id}>
                    {property.title} - {property.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProperty && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700">Dispute against:</p>
              <p className="text-sm text-gray-600">{selectedProperty.landlord?.name || "Unknown Landlord"}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.property || !formData.description.trim()}
            >
              {isLoading ? "Creating..." : "Create Dispute"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}