import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: "tenant" | "landlord" | "admin"
  status: "active" | "suspended"
  createdAt: string
}

interface AdminProperty {
  _id: string
  title: string
  address: string
  rentAmount: number
  status: "pending" | "approved" | "rejected"
  landlord: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  approved?: boolean
}

interface AdminDispute {
  _id: string
  description: string
  status: "pending" | "in-progress" | "resolved"
  createdBy: {
    _id: string
    name: string
    email: string
  }
  againstUser: {
    _id: string
    name: string
    email: string
  }
  property: {
    _id: string
    title: string
  }
  assignedTo?: {
    _id: string
    name: string
  }
  resolutionNote?: string
  createdAt: string
}

interface AdminState {
  users: User[]
  properties: AdminProperty[]
  disputes: AdminDispute[]
  stats: {
    totalUsers: number
    totalProperties: number
    totalDisputes: number
    pendingApprovals: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: AdminState = {
  users: [],
  properties: [],
  disputes: [],
  stats: {
    totalUsers: 0,
    totalProperties: 0,
    totalDisputes: 0,
    pendingApprovals: 0,
  },
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/users")
    console.log("Admin fetchAllUsers response:", response.data)

    // Handle different possible response structures
    const users = response.data.data || response.data.users || response.data || []
    console.log("Extracted users:", users)

    return users
  } catch (error: any) {
    console.error("fetchAllUsers error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users")
  }
})

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, status }: { userId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status })
      return { userId, status }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user status")
    }
  },
)

export const fetchAllProperties = createAsyncThunk("admin/fetchAllProperties", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/properties")
    console.log("Admin fetchAllProperties response:", response.data)

    // Handle different possible response structures
    const properties = response.data.data || response.data.properties || response.data || []
    console.log("Extracted properties:", properties)

    return properties
  } catch (error: any) {
    console.error("fetchAllProperties error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch properties")
  }
})

export const approveProperty = createAsyncThunk(
  "admin/approveProperty",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/properties/${propertyId}/approve`)
      return propertyId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to approve property")
    }
  },
)

export const fetchAllDisputes = createAsyncThunk("admin/fetchAllDisputes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/admin/all")
    console.log("Admin fetchAllDisputes response:", response.data)

    // Handle different possible response structures
    const disputes = response.data.data || response.data.disputes || response.data || []
    console.log("Extracted disputes:", disputes)

    return disputes
  } catch (error: any) {
    console.error("fetchAllDisputes error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to fetch disputes")
  }
})

export const deleteDispute = createAsyncThunk("admin/deleteDispute", async (disputeId: string, { rejectWithValue }) => {
  try {
    console.log("[v0] Deleting dispute:", disputeId)
    const response = await api.delete(`/admin/${disputeId}`)
    console.log("[v0] Delete dispute response:", response.data)
    return disputeId
  } catch (error: any) {
    console.error("[v0] Delete dispute error:", error)
    return rejectWithValue(error.response?.data?.message || "Failed to delete dispute")
  }
})

const validateDisputeStatus = (status: string): "pending" | "in-progress" | "resolved" => {
  const validStatuses = ["pending", "in-progress", "resolved", "rejected"] as const
  return validStatuses.includes(status as any) ? (status as any) : "pending"
}

export const assignMediator = createAsyncThunk(
  "admin/assignMediator",
  async ({ disputeId, assignedTo }: { disputeId: string; assignedTo: string }, { rejectWithValue }) => {
    try {
      console.log("[v0] Assigning mediator:", { disputeId, assignedTo })
      const response = await api.put(`/admin/${disputeId}/assign`, { assignedTo })
      console.log("[v0] Mediator assignment response:", response.data)
      return { disputeId, assignedTo, response: response.data }
    } catch (error: any) {
      console.error("[v0] Mediator assignment error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to assign mediator")
    }
  },
)

export const updateDisputeStatus = createAsyncThunk(
  "admin/updateDisputeStatus",
  async (
    { disputeId, status, resolutionNote }: { disputeId: string; status: string; resolutionNote?: string },
    { rejectWithValue },
  ) => {
    try {
      console.log("[v0] Updating dispute status:", { disputeId, status, resolutionNote })
      const response = await api.put(`/admin/${disputeId}/status`, { status, resolutionNote })
      console.log("[v0] Status update response:", response.data)
      return { disputeId, status: validateDisputeStatus(status), resolutionNote, response: response.data }
    } catch (error: any) {
      console.error("[v0] Status update error:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to update dispute status")
    }
  },
)

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        const users = action.payload || []
        state.users = users
        state.stats.totalUsers = users.length
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload
        const user = state.users.find((u) => u._id === userId)
        if (user) {
          user.status = status as "active" | "suspended"
        }
      })

      // Fetch all properties
      .addCase(fetchAllProperties.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.isLoading = false
        const properties = action.payload || []
        state.properties = properties
        state.stats.totalProperties = properties.length
        state.stats.pendingApprovals = properties.filter(
          (p: any) => p.status === "pending" || p.approved === false,
        ).length
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Approve property
      .addCase(approveProperty.fulfilled, (state, action) => {
        const property = state.properties.find((p) => p._id === action.payload)
        if (property) {
          property.status = "approved"
          state.stats.pendingApprovals = (state.properties || []).filter(
            (p: any) => p.status === "pending" || p.approved === false,
          ).length
        }
      })

      // Fetch all disputes
      .addCase(fetchAllDisputes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllDisputes.fulfilled, (state, action) => {
        state.isLoading = false
        const disputes = action.payload || []
        state.disputes = disputes
        state.stats.totalDisputes = disputes.length
      })
      .addCase(fetchAllDisputes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Assign mediator
      .addCase(assignMediator.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(assignMediator.fulfilled, (state, action) => {
        state.isLoading = false
        const { disputeId, assignedTo } = action.payload
        const dispute = state.disputes.find((d) => d._id === disputeId)
        if (dispute) {
          dispute.status = validateDisputeStatus("in-progress")
          dispute.assignedTo = { _id: assignedTo, name: "Assigned Mediator" }
          console.log("[v0] Dispute status updated to in-progress:", dispute._id)
        } else {
          console.error("[v0] Dispute not found for mediator assignment:", disputeId)
        }
      })
      .addCase(assignMediator.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("[v0] Mediator assignment failed:", action.payload)
      })

      // Update dispute status
      .addCase(updateDisputeStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateDisputeStatus.fulfilled, (state, action) => {
        state.isLoading = false
        const { disputeId, status, resolutionNote } = action.payload
        const dispute = state.disputes.find((d) => d._id === disputeId)
        if (dispute) {
          dispute.status = validateDisputeStatus(status)
          if (resolutionNote) {
            dispute.resolutionNote = resolutionNote
          }
          console.log("[v0] Dispute status updated:", { disputeId, status: dispute.status })
        } else {
          console.error("[v0] Dispute not found for status update:", disputeId)
        }
      })
      .addCase(updateDisputeStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("[v0] Status update failed:", action.payload)
      })

      // Delete dispute
      .addCase(deleteDispute.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteDispute.fulfilled, (state, action) => {
        state.isLoading = false
        const disputeId = action.payload
        state.disputes = state.disputes.filter((d) => d._id !== disputeId)
        state.stats.totalDisputes = state.disputes.length
        console.log("[v0] Dispute deleted successfully:", disputeId)
      })
      .addCase(deleteDispute.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error("[v0] Delete dispute failed:", action.payload)
      })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
