import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { Booking } from "@/types"

interface BookingState {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const requestInspection = createAsyncThunk(
  "booking/request",
  async ({ propertyId, message }: { propertyId: string; message: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/request", { propertyId, message })
      console.log("Request inspection response:", response.data)

      // Handle different possible response structures
      const booking = response.data.booking || response.data.data || response.data
      return booking
    } catch (error: any) {
      console.error("Request inspection error:", error.response?.data)
      return rejectWithValue(error.response?.data?.message || "Failed to request inspection")
    }
  },
)

export const fetchMyBookings = createAsyncThunk("booking/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/booking/me")
    console.log("Fetch my bookings response:", response.data)

    // Handle different possible response structures
    const bookings = response.data.bookings || response.data.data || response.data
    return Array.isArray(bookings) ? bookings : []
  } catch (error: any) {
    console.error("Fetch my bookings error:", error.response?.data)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings")
  }
})

export const fetchLandlordBookings = createAsyncThunk("booking/fetchLandlord", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/booking/landlord")
    console.log("Fetch landlord bookings response:", response.data)

    // Handle different possible response structures
    const bookings = response.data.bookings || response.data.data || response.data
    return Array.isArray(bookings) ? bookings : []
  } catch (error: any) {
    console.error("Fetch landlord bookings error:", error.response?.data)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings")
  }
})

export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }: { bookingId: string; status: "approved" | "rejected" }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/booking/${bookingId}/status`, { status })
      console.log("Update booking status response:", response.data)

      // Handle different possible response structures
      const booking = response.data.booking || response.data.data || response.data
      return booking
    } catch (error: any) {
      console.error("Update booking status error:", error.response?.data)
      return rejectWithValue(error.response?.data?.message || "Failed to update booking status")
    }
  },
)

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Request inspection
      .addCase(requestInspection.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(requestInspection.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload && !state.bookings.find((b) => b._id === action.payload._id)) {
          state.bookings.push(action.payload)
        }
      })
      .addCase(requestInspection.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch my bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookings = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch landlord bookings
      .addCase(fetchLandlordBookings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLandlordBookings.fulfilled, (state, action) => {
        state.isLoading = false
        state.bookings = Array.isArray(action.payload) ? action.payload : []
        console.log("Landlord bookings loaded:", state.bookings.length)
      })
      .addCase(fetchLandlordBookings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload && state.bookings) {
          const index = state.bookings.findIndex((b) => b._id === action.payload._id)
          if (index !== -1) {
            state.bookings[index] = action.payload
          }
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = bookingSlice.actions
export default bookingSlice.reducer
