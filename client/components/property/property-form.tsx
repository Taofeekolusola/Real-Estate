"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/types"
import { X, Upload, Plus } from "lucide-react"

interface PropertyFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isLoading: boolean
  initialData?: Property
  error?: any
}

export function PropertyForm({ onSubmit, isLoading, initialData, error }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    rentAmount: "",
    agencyFee: "",
    legalFee: "",
    agreementUrl: "",
    durationInMonths: "",
  })

  const [paymentOptions, setPaymentOptions] = useState<string[]>([])
  const [newPaymentOption, setNewPaymentOption] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const commonPaymentOptions = ["yearly", "bi-annual", "quarterly", "monthly", "weekly"]

  useEffect(() => {
  if (initialData) {
    setFormData({
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      address: initialData.address ?? "",
      rentAmount: initialData.rentAmount?.toString() ?? "",
      agencyFee: initialData.agencyFee?.toString() ?? "",
      legalFee: initialData.legalFee?.toString() ?? "",
      agreementUrl: initialData.agreementUrl ?? "",
      durationInMonths: initialData.durationInMonths?.toString() ?? "",
    });
    setPaymentOptions(initialData.paymentOptions ?? []);
  }
}, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentOptionToggle = (option: string) => {
    setPaymentOptions((prev) => {
      const currentOptions = prev || []
      return currentOptions.includes(option) ? currentOptions.filter((o) => o !== option) : [...currentOptions, option]
    })
  }

  const addCustomPaymentOption = () => {
    if (newPaymentOption.trim() && !paymentOptions.includes(newPaymentOption.trim())) {
      setPaymentOptions((prev) => {
        const currentOptions = prev || []
        return [...currentOptions, newPaymentOption.trim()]
      })
      setNewPaymentOption("")
    }
  }

  const removePaymentOption = (option: string) => {
    setPaymentOptions((prev) => {
      const currentOptions = prev || []
      return currentOptions.filter((o) => o !== option)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => {
      const currentFiles = prev || []
      if (files.length + currentFiles.length > 5) {
        alert("Maximum 5 images allowed")
        return currentFiles
      }
      return [...currentFiles, ...files]
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const currentFiles = prev || []
      return currentFiles.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentOptions.length === 0) {
      alert("Please select at least one payment option")
      return
    }

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.address.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (!formData.rentAmount || !formData.durationInMonths) {
      alert("Please enter rent amount and duration")
      return
    }

    const submitData = new FormData()

    submitData.append("title", formData.title.trim())
    submitData.append("description", formData.description.trim())
    submitData.append("address", formData.address.trim())
    submitData.append("rentAmount", formData.rentAmount)
    submitData.append("agencyFee", formData.agencyFee || "0")
    submitData.append("legalFee", formData.legalFee || "0")
    submitData.append("durationInMonths", formData.durationInMonths)

    submitData.append("paymentOptions", paymentOptions.join(","))

    if (formData.agreementUrl.trim()) {
      submitData.append("agreementUrl", formData.agreementUrl.trim())
    }

    selectedFiles.forEach((file) => {
      submitData.append("images", file)
    })

    console.log("Submitting property data:")
    console.log("Form fields:")
    for (const [key, value] of submitData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes)`)
      } else {
        console.log(`${key}: ${value}`)
      }
    }

    try {
      await onSubmit(submitData)
    } catch (error: any) {
      console.error("Property submission error:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error message:", error.message)
    }
  }

  const renderViolations = () => {
    if (!error?.isLagosViolation || !error?.violations) return null

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold">{error.message}</p>
            <ul className="list-disc list-inside space-y-1">
              {error.violations.map((violation: any, index: number) => (
                <li key={index} className="text-sm">
                  <strong>{violation.reason}:</strong> {violation.detail}
                </li>
              ))}
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Property" : "Add New Property"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderViolations()}

          {error && !error.isLagosViolation && (
            <Alert variant="destructive">
              <AlertDescription>
                {typeof error === "string" ? error : error.message || "Failed to save property"}
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Modern 3-bedroom apartment"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g., Victoria Island, Lagos"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Rent Amount (₦) *</Label>
                <Input
                  id="rentAmount"
                  name="rentAmount"
                  type="number"
                  placeholder="e.g., 2500000"
                  value={formData.rentAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agencyFee">Agency Fee (₦)</Label>
                <Input
                  id="agencyFee"
                  name="agencyFee"
                  type="number"
                  placeholder="e.g., 250000"
                  value={formData.agencyFee}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalFee">Legal Fee (₦)</Label>
                <Input
                  id="legalFee"
                  name="legalFee"
                  type="number"
                  placeholder="e.g., 100000"
                  value={formData.legalFee}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationInMonths">Duration (Months) *</Label>
                <Input
                  id="durationInMonths"
                  name="durationInMonths"
                  type="number"
                  placeholder="e.g., 12"
                  value={formData.durationInMonths}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agreementUrl">Agreement URL (Optional)</Label>
                <Input
                  id="agreementUrl"
                  name="agreementUrl"
                  type="url"
                  placeholder="https://example.com/agreement.pdf"
                  value={formData.agreementUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Options *</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonPaymentOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={paymentOptions.includes(option)}
                      onCheckedChange={() => handlePaymentOptionToggle(option)}
                    />
                    <Label htmlFor={option} className="text-sm capitalize">
                      {option.replace("-", " ")}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom payment option"
                  value={newPaymentOption}
                  onChange={(e) => setNewPaymentOption(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomPaymentOption())}
                />
                <Button type="button" onClick={addCustomPaymentOption} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {paymentOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map((option) => (
                    <Badge key={option} variant="secondary" className="flex items-center space-x-1">
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => removePaymentOption(option)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Images</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> property images
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5 images)</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update Property" : "Add Property"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
