"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchProperties } from "@/store/slices/propertySlice"
import { Navbar } from "@/components/layout/navbar"
import { PropertyCard } from "@/components/property/property-card"
import { PropertyFilters } from "@/components/property/property-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { Property } from "@/types"

export default function PropertiesPage() {
  const dispatch = useAppDispatch()
  const { properties = [], isLoading } = useAppSelector((state) => state.property)

  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRent: "",
    maxRent: "",
    location: "",
    duration: "",
  })

  useEffect(() => {
    dispatch(fetchProperties())
  }, [dispatch])

  const filteredProperties = properties.filter((property: Property) => {
    const isApproved = property.status === "approved"
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMinRent = !filters.minRent || property.rentAmount >= Number(filters.minRent)
    const matchesMaxRent = !filters.maxRent || property.rentAmount <= Number(filters.maxRent)
    const matchesLocation = !filters.location ||
      property.address.toLowerCase().includes(filters.location.toLowerCase())
    const matchesDuration = !filters.duration ||
      (property.durationInMonths ?? 0) >= Number(filters.duration)

    return isApproved && matchesSearch && matchesMinRent && matchesMaxRent && matchesLocation && matchesDuration
  })

  const renderSkeletons = (count: number) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h1>
          <p className="text-gray-600">Find your perfect rental property</p>
        </header>

        {/* Search and Filters */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters((prev) => !prev)} className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>

          {showFilters && <PropertyFilters filters={filters} onFiltersChange={setFilters} />}
        </section>

        {/* Properties Grid */}
        {isLoading ? (
          renderSkeletons(6)
        ) : filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}