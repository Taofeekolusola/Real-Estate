// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import api from "@/lib/api"
// import type { Rating } from "@/types"

// interface RatingState {
//   ratings: Rating[]
//   landlordRatings: Rating[]
//   tenantRatings: Rating[]
//   isLoading: boolean
//   error: string | null
// }

// const initialState: RatingState = {
//   ratings: [],
//   landlordRatings: [],
//   tenantRatings: [],
//   isLoading: false,
//   error: null,
// }

// // Async thunks
// export const createRating = createAsyncThunk(
//   "rating/create",
//   async (ratingData: { landlord: string; rating: number; comment: string }, { rejectWithValue }) => {
//     try {
//       const apiData = {
//         landlordId: ratingData.landlord,
//         rating: ratingData.rating,
//         comment: ratingData.comment,
//       }

//       console.log("[v0] Creating rating with data:", apiData)
//       console.log("[v0] API endpoint: /ratings")

//       const response = await api.post("/ratings", apiData)

//       console.log("[v0] Rating creation successful:", response.data)
//       return response.data.rating || response.data
//     } catch (error: any) {
//       console.error("[v0] Rating creation failed:")
//       console.error("[v0] Error status:", error.response?.status)
//       console.error("[v0] Error data:", error.response?.data)
//       console.error("[v0] Error message:", error.response?.data?.message)
//       console.error("[v0] Full error:", error)

//       return rejectWithValue(error.response?.data?.message || "Failed to create rating")
//     }
//   },
// )

// export const fetchLandlordRatings = createAsyncThunk(
//   "rating/fetchLandlord",
//   async (landlordId: string, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/ratings/${landlordId}`)
//       return response.data.ratings || response.data
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch ratings")
//     }
//   },
// )

// export const deleteRating = createAsyncThunk("rating/delete", async (ratingId: string, { rejectWithValue }) => {
//   try {
//     console.log("[v0] Deleting rating:", ratingId)
//     const response = await api.delete(`/ratings/${ratingId}`)
//     console.log("[v0] Delete rating response:", response.data)
//     return ratingId
//   } catch (error: any) {
//     console.error("[v0] Delete rating error:", error)
//     return rejectWithValue(error.response?.data?.message || "Failed to delete rating")
//   }
// })

// export const getRatingsByTenant = createAsyncThunk(
//   "rating/fetchByTenant",
//   async (tenantId: string, { rejectWithValue }) => {
//     try {
//       console.log("[v0] Fetching ratings by tenant:", tenantId)
//       const response = await api.get(`/ratings`)
//       console.log("[v0] Tenant ratings response:", response.data)
//       return response.data.ratings || response.data || []
//     } catch (error: any) {
//       console.error("[v0] Fetch tenant ratings error:", error)
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch tenant ratings")
//     }
//   },
// )

// export const fetchRatingsByTenant = getRatingsByTenant

// const ratingSlice = createSlice({
//   name: "rating",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     clearLandlordRatings: (state) => {
//       state.landlordRatings = []
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create rating
//       .addCase(createRating.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(createRating.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.ratings.push(action.payload)
//       })
//       .addCase(createRating.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       // Fetch landlord ratings
//       .addCase(fetchLandlordRatings.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchLandlordRatings.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.landlordRatings = action.payload
//       })
//       .addCase(fetchLandlordRatings.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       .addCase(deleteRating.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(deleteRating.fulfilled, (state, action) => {
//         state.isLoading = false
//         const ratingId = action.payload
//         state.ratings = state.ratings.filter((r) => r._id !== ratingId)
//         state.landlordRatings = state.landlordRatings.filter((r) => r._id !== ratingId)
//         state.tenantRatings = state.tenantRatings.filter((r) => r._id !== ratingId)
//         console.log("[v0] Rating deleted successfully:", ratingId)
//       })
//       .addCase(deleteRating.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//         console.error("[v0] Delete rating failed:", action.payload)
//       })
//       .addCase(getRatingsByTenant.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(getRatingsByTenant.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.tenantRatings = action.payload
//         console.log("[v0] Tenant ratings loaded:", action.payload.length)
//       })
//       .addCase(getRatingsByTenant.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//         console.error("[v0] Fetch tenant ratings failed:", action.payload)
//       })
//   },
// })

// export const { clearError, clearLandlordRatings } = ratingSlice.actions
// export default ratingSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { Rating } from "@/types"

interface RatingState {
  ratings: Rating[]
  landlordRatings: Rating[]
  tenantRatings: Rating[]
  isLoading: boolean
  error: string | null
}

const initialState: RatingState = {
  ratings: [],
  landlordRatings: [],
  tenantRatings: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const createRating = createAsyncThunk(
  "rating/create",
  async (
    ratingData: { landlord: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const apiData = {
        landlordId: ratingData.landlord,
        rating: ratingData.rating,
        comment: ratingData.comment,
      }

      console.log("[rating] Creating rating with:", apiData)
      const response = await api.post("/ratings", apiData)
      console.log("[rating] Rating created:", response.data)

      return response.data.rating || response.data
    } catch (error: any) {
      console.error("[rating] Create rating error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to create rating")
    }
  }
)

export const fetchLandlordRatings = createAsyncThunk(
  "rating/fetchLandlord",
  async (landlordId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/ratings/${landlordId}`)
      return response.data.ratings || response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch ratings")
    }
  }
)

export const deleteRating = createAsyncThunk(
  "rating/delete",
  async (ratingId: string, { rejectWithValue }) => {
    try {
      console.log("[rating] Deleting rating:", ratingId)
      await api.delete(`/ratings/${ratingId}`)
      return ratingId
    } catch (error: any) {
      console.error("[rating] Delete rating error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to delete rating")
    }
  }
)

export const getRatingsByTenant = createAsyncThunk(
  "rating/fetchByTenant",
  async (tenantId: string, { rejectWithValue }) => {
    try {
      console.log("[rating] Fetching tenant ratings:", tenantId)
      const response = await api.get(`/ratings`)
      return response.data.ratings || response.data || []
    } catch (error: any) {
      console.error("[rating] Fetch tenant ratings error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tenant ratings")
    }
  }
)

export const fetchRatingsByTenant = getRatingsByTenant

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearLandlordRatings: (state) => {
      state.landlordRatings = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRating.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.isLoading = false
        state.ratings.push(action.payload)
      })
      .addCase(createRating.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchLandlordRatings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLandlordRatings.fulfilled, (state, action) => {
        state.isLoading = false
        state.landlordRatings = action.payload
      })
      .addCase(fetchLandlordRatings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteRating.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.isLoading = false
        const ratingId = action.payload
        state.ratings = state.ratings.filter((r) => r._id !== ratingId)
        state.landlordRatings = state.landlordRatings.filter((r) => r._id !== ratingId)
        state.tenantRatings = state.tenantRatings.filter((r) => r._id !== ratingId)
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(getRatingsByTenant.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRatingsByTenant.fulfilled, (state, action) => {
        state.isLoading = false
        state.tenantRatings = action.payload
      })
      .addCase(getRatingsByTenant.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearLandlordRatings } = ratingSlice.actions
export default ratingSlice.reducer
