// "use client"

// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface PropertyFiltersProps {
//   filters: {
//     minRent: string
//     maxRent: string
//     location: string
//     duration: string
//   }
//   onFiltersChange: (filters: any) => void
// }

// export function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
//   const handleFilterChange = (key: string, value: string) => {
//     onFiltersChange({ ...filters, [key]: value })
//   }

//   return (
//     <div className="mt-4 pt-4 border-t">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="minRent">Min Rent (₦)</Label>
//           <Input
//             id="minRent"
//             type="number"
//             placeholder="0"
//             value={filters.minRent}
//             onChange={(e) => handleFilterChange("minRent", e.target.value)}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="maxRent">Max Rent (₦)</Label>
//           <Input
//             id="maxRent"
//             type="number"
//             placeholder="10000000"
//             value={filters.maxRent}
//             onChange={(e) => handleFilterChange("maxRent", e.target.value)}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="location">Location</Label>
//           <Input
//             id="location"
//             placeholder="Enter location"
//             value={filters.location}
//             onChange={(e) => handleFilterChange("location", e.target.value)}
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="duration">Min Duration (months)</Label>
//           <Select value={filters.duration} onValueChange={(value) => handleFilterChange("duration", value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Any duration" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="any">Any duration</SelectItem>
//               <SelectItem value="6">6+ months</SelectItem>
//               <SelectItem value="12">12+ months</SelectItem>
//               <SelectItem value="24">24+ months</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Filters {
  minRent: string
  maxRent: string
  location: string
  duration: string
}

interface PropertyFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="minRent">Min Rent (₦)</Label>
          <Input
            id="minRent"
            type="number"
            placeholder="0"
            value={filters.minRent}
            onChange={(e) => handleFilterChange("minRent", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxRent">Max Rent (₦)</Label>
          <Input
            id="maxRent"
            type="number"
            placeholder="10000000"
            value={filters.maxRent}
            onChange={(e) => handleFilterChange("maxRent", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Min Duration (months)</Label>
          <Select value={filters.duration} onValueChange={(value) => handleFilterChange("duration", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any duration</SelectItem>
              <SelectItem value="6">6+ months</SelectItem>
              <SelectItem value="12">12+ months</SelectItem>
              <SelectItem value="24">24+ months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}