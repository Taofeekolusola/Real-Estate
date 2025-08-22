import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { Property } from "@/types"

interface PropertyState {
  properties: Property[]
  currentProperty: Property | null
  isLoading: boolean
  error: string | null | { message: string; violations: any; isLagosViolation: boolean }
}

const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchProperties = createAsyncThunk("property/fetchAll", async (_, { rejectWithValue }) => {
  try {
    console.log("[v0] Attempting to fetch properties from:", `${api.defaults.baseURL}/properties`)
    const response = await api.get("/properties")
    console.log("[v0] Fetch properties API response:", response.data)

    let properties = response.data
    if (response.data.properties) {
      properties = response.data.properties
    } else if (response.data.data) {
      properties = response.data.data
    } else if (Array.isArray(response.data)) {
      properties = response.data
    }

    console.log("[v0] Extracted properties:", properties)
    return properties
  } catch (error: any) {
    console.error("[v0] Fetch properties error details:", {
      message: error.message,
      code: error.code,
      response: error.response,
      request: error.request,
      config: error.config,
    })

    // Check if it's a network error
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      console.error("[v0] Network Error - Backend may not be running on localhost:5000")
      return rejectWithValue("Cannot connect to backend server. Please ensure the backend is running on localhost:5000")
    }

    if (!error.response) {
      console.error("[v0] No response received - possible CORS or connection issue")
      return rejectWithValue("Connection failed. Please check if the backend server is running.")
    }

    return rejectWithValue(error.response?.data?.message || "Failed to fetch properties")
  }
})

export const fetchPropertyById = createAsyncThunk("property/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await api.get(`/properties/${id}`)
    console.log("Fetch property by ID API response:", response.data)

    let property = response.data
    if (response.data.property) {
      property = response.data.property
    } else if (response.data.data) {
      property = response.data.data
    }

    return property
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch property")
  }
})

export const createProperty = createAsyncThunk(
  "property/create",
  async (propertyData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/properties", propertyData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Create property API response:", response.data)

      let property = response.data
      if (response.data.property) {
        property = response.data.property
      } else if (response.data.data) {
        property = response.data.data
      }

      return property
    } catch (error: any) {
      console.error("Create property error:", error)
      const errorData = error.response?.data
      if (errorData?.violations) {
        return rejectWithValue({
          message: errorData.message,
          violations: errorData.violations,
          isLagosViolation: true,
        })
      }
      return rejectWithValue(errorData?.message || "Failed to create property")
    }
  },
)

export const updateProperty = createAsyncThunk(
  "property/update",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/properties/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Update property API response:", response.data)

      let property = response.data
      if (response.data.property) {
        property = response.data.property
      } else if (response.data.data) {
        property = response.data.data
      }

      return property
    } catch (error: any) {
      const errorData = error.response?.data
      if (errorData?.violations) {
        return rejectWithValue({
          message: errorData.message,
          violations: errorData.violations,
          isLagosViolation: true,
        })
      }
      return rejectWithValue(errorData?.message || "Failed to update property")
    }
  },
)

export const deleteProperty = createAsyncThunk("property/delete", async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/properties/${id}`)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete property")
  }
})

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all properties
      .addCase(fetchProperties.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.isLoading = false
        state.properties = action.payload
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProperty = action.payload
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false
        if (!state.properties) {
          state.properties = []
        }
        state.properties.push(action.payload)
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update property
      .addCase(updateProperty.fulfilled, (state, action) => {
        if (!state.properties) {
          state.properties = []
        }
        const index = state.properties.findIndex((p) => p._id === action.payload._id)
        if (index !== -1) {
          state.properties[index] = action.payload
        }
        state.currentProperty = action.payload
      })
      // Delete property
      .addCase(deleteProperty.fulfilled, (state, action) => {
        if (!state.properties) {
          state.properties = []
        }
        state.properties = state.properties.filter((p) => p._id !== action.payload)
      })
  },
})

export const { clearError, clearCurrentProperty } = propertySlice.actions
export default propertySlice.reducer

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import api from "@/lib/api"
// import type { Property } from "@/types"

// interface PropertyState {
//   properties: Property[]
//   currentProperty: Property | null
//   isLoading: boolean
//   error: string | null | { message: string; violations: any; isLagosViolation: boolean }
// }

// const initialState: PropertyState = {
//   properties: [],
//   currentProperty: null,
//   isLoading: false,
//   error: null,
// }

// // Async thunks
// export const fetchProperties = createAsyncThunk("property/fetchAll", async (_, { rejectWithValue }) => {
//   try {
//     console.log("[v0] Attempting to fetch properties from:", `${api.defaults.baseURL}/properties`)
//     const response = await api.get("/properties")
//     console.log("[v0] Fetch properties API response:", response.data)

//     let properties = response.data
//     if (response.data.properties) {
//       properties = response.data.properties
//     } else if (response.data.data) {
//       properties = response.data.data
//     } else if (Array.isArray(response.data)) {
//       properties = response.data
//     }

//     return properties
//   } catch (error: any) {
//     console.error("[v0] Fetch properties error details:", {
//       message: error.message,
//       code: error.code,
//       response: error.response,
//     })

//     if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
//       return rejectWithValue("Cannot connect to backend server. Please ensure the backend is running.")
//     }

//     if (!error.response) {
//       return rejectWithValue("Connection failed. Please check if the backend server is running.")
//     }

//     return rejectWithValue(error.response?.data?.message || "Failed to fetch properties")
//   }
// })

// export const fetchPropertyById = createAsyncThunk("property/fetchById", async (id: string, { rejectWithValue }) => {
//   try {
//     const response = await api.get(`/properties/${id}`)
//     let property = response.data
//     if (response.data.property) {
//       property = response.data.property
//     } else if (response.data.data) {
//       property = response.data.data
//     }
//     return property
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Failed to fetch property")
//   }
// })

// export const createProperty = createAsyncThunk("property/create", async (propertyData: FormData, { rejectWithValue }) => {
//   try {
//     const response = await api.post("/properties", propertyData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     })
//     let property = response.data
//     if (response.data.property) {
//       property = response.data.property
//     } else if (response.data.data) {
//       property = response.data.data
//     }
//     return property
//   } catch (error: any) {
//     const errorData = error.response?.data
//     if (errorData?.violations) {
//       return rejectWithValue({
//         message: errorData.message,
//         violations: errorData.violations,
//         isLagosViolation: true,
//       })
//     }
//     return rejectWithValue(errorData?.message || "Failed to create property")
//   }
// })

// export const updateProperty = createAsyncThunk(
//   "property/update",
//   async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
//     try {
//       const response = await api.put(`/properties/${id}`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       let property = response.data
//       if (response.data.property) {
//         property = response.data.property
//       } else if (response.data.data) {
//         property = response.data.data
//       }
//       return property
//     } catch (error: any) {
//       const errorData = error.response?.data
//       if (errorData?.violations) {
//         return rejectWithValue({
//           message: errorData.message,
//           violations: errorData.violations,
//           isLagosViolation: true,
//         })
//       }
//       return rejectWithValue(errorData?.message || "Failed to update property")
//     }
//   }
// )

// export const deleteProperty = createAsyncThunk("property/delete", async (id: string, { rejectWithValue }) => {
//   try {
//     await api.delete(`/properties/${id}`)
//     return id
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Failed to delete property")
//   }
// })

// const propertySlice = createSlice({
//   name: "property",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     clearCurrentProperty: (state) => {
//       state.currentProperty = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProperties.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchProperties.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.properties = action.payload
//       })
//       .addCase(fetchProperties.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       .addCase(fetchPropertyById.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchPropertyById.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.currentProperty = action.payload
//       })
//       .addCase(fetchPropertyById.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       .addCase(createProperty.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(createProperty.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.properties.push(action.payload)
//       })
//       .addCase(createProperty.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       .addCase(updateProperty.fulfilled, (state, action) => {
//         const index = state.properties.findIndex((p) => p._id === action.payload._id)
//         if (index !== -1) {
//           state.properties[index] = action.payload
//         }
//         state.currentProperty = action.payload
//       })
//       .addCase(deleteProperty.fulfilled, (state, action) => {
//         state.properties = state.properties.filter((p) => p._id !== action.payload)
//       })
//   },
// })

// export const { clearError, clearCurrentProperty } = propertySlice.actions
// export default propertySlice.reducer
