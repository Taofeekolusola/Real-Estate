import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { Dispute } from "@/types"

interface DisputeState {
  disputes: Dispute[]
  isLoading: boolean
  error: string | null
}

const initialState: DisputeState = {
  disputes: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const createDispute = createAsyncThunk(
  "dispute/create",
  async (disputeData: { againstUser: string; property: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/dispute", disputeData)
      return response.data.dispute
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create dispute")
    }
  },
)

export const fetchUserDisputes = createAsyncThunk("dispute/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/dispute")
    return response.data.disputes
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch disputes")
  }
})

const disputeSlice = createSlice({
  name: "dispute",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create dispute
      .addCase(createDispute.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createDispute.fulfilled, (state, action) => {
        state.isLoading = false
        state.disputes.push(action.payload)
      })
      .addCase(createDispute.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch user disputes
      .addCase(fetchUserDisputes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserDisputes.fulfilled, (state, action) => {
        state.isLoading = false
        state.disputes = action.payload
      })
      .addCase(fetchUserDisputes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = disputeSlice.actions
export default disputeSlice.reducer
