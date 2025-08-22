// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import api from "@/lib/api"
// import type { Payment } from "@/types"

// interface PaymentState {
//   payments: Payment[]
//   currentPayment: Payment | null
//   isLoading: boolean
//   error: string | null
// }

// const initialState: PaymentState = {
//   payments: [],
//   currentPayment: null,
//   isLoading: false,
//   error: null,
// }

// // Async thunks
// export const initializePayment = createAsyncThunk(
//   "payment/initialize",
//   async ({ email, amount, bookingId }: { email: string; amount: number; bookingId: string }, { rejectWithValue }) => {
//     try {
//       console.log("Payment slice - sending data:", { email, amount, bookingId, amountType: typeof amount })
//       const response = await api.post("/payment/initialize", { email, amount, bookingId })
//       console.log("Payment slice - API response:", response.data)
//       return response.data
//     } catch (error: any) {
//       console.error("Payment slice - API error:", error)
//       console.error("Payment slice - Error response:", error.response?.data)

//       let errorMessage = "Failed to initialize payment"

//       if (error.response?.data) {
//         const errorData = error.response.data
//         if (typeof errorData === "string") {
//           errorMessage = errorData
//         } else if (errorData.message) {
//           errorMessage = errorData.message
//         } else if (errorData.error) {
//           errorMessage = errorData.error
//         } else if (errorData.meta?.nextStep) {
//           errorMessage = `${errorData.message || "Payment error"}: ${errorData.meta.nextStep}`
//         }
//       } else if (error.message) {
//         errorMessage = error.message
//       }

//       console.log("Payment slice - Final error message:", errorMessage)
//       return rejectWithValue(errorMessage)
//     }
//   },
// )

// export const verifyPayment = createAsyncThunk("payment/verify", async (reference: string, { rejectWithValue }) => {
//   try {
//     const response = await api.get(`/payment/verify/${reference}`)
//     return response.data
//   } catch (error: any) {
//     console.error("Payment slice - API error:", error)
//     console.error("Payment slice - Error response:", error.response?.data)

//     let errorMessage = "Failed to verify payment"

//     if (error.response?.data) {
//       const errorData = error.response.data
//       if (typeof errorData === "string") {
//         errorMessage = errorData
//       } else if (errorData.message) {
//         errorMessage = errorData.message
//       } else if (errorData.error) {
//         errorMessage = errorData.error
//       } else if (errorData.meta?.nextStep) {
//         errorMessage = `${errorData.message || "Payment error"}: ${errorData.meta.nextStep}`
//       }
//     } else if (error.message) {
//       errorMessage = error.message
//     }

//     console.log("Payment slice - Final error message:", errorMessage)
//     return rejectWithValue(errorMessage)
//   }
// })

// const paymentSlice = createSlice({
//   name: "payment",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     clearCurrentPayment: (state) => {
//       state.currentPayment = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Initialize payment
//       .addCase(initializePayment.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(initializePayment.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.currentPayment = action.payload.payment
//       })
//       .addCase(initializePayment.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       // Verify payment
//       .addCase(verifyPayment.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(verifyPayment.fulfilled, (state, action) => {
//         state.isLoading = false
//         if (action.payload.payment) {
//           state.currentPayment = action.payload.payment
//           const existingIndex = state.payments.findIndex((p) => p._id === action.payload.payment._id)
//           if (existingIndex !== -1) {
//             state.payments[existingIndex] = action.payload.payment
//           } else {
//             state.payments.push(action.payload.payment)
//           }
//         }
//       })
//       .addCase(verifyPayment.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const { clearError, clearCurrentPayment } = paymentSlice.actions
// export default paymentSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { Payment } from "@/types"

interface PaymentState {
  payments: Payment[]
  currentPayment: Payment | null
  isLoading: boolean
  error: string | null
}

const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const initializePayment = createAsyncThunk(
  "payment/initialize",
  async (
    { email, amount, bookingId }: { email: string; amount: number; bookingId: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Payment slice - sending data:", { email, amount, bookingId })
      const response = await api.post("/payment/initialize", { email, amount, bookingId })
      console.log("Payment slice - API response:", response.data)
      return response.data
    } catch (error: any) {
      console.error("Payment slice - API error:", error)
      console.error("Payment slice - Error response:", error.response?.data)

      let errorMessage = "Failed to initialize payment"

      if (error.response?.data) {
        const errorData = error.response.data
        if (typeof errorData === "string") {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.meta?.nextStep) {
          errorMessage = `${errorData.message || "Payment error"}: ${errorData.meta.nextStep}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      return rejectWithValue(errorMessage)
    }
  }
)

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (reference: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payment/verify/${reference}`)
      return response.data
    } catch (error: any) {
      console.error("Payment slice - API error:", error)
      console.error("Payment slice - Error response:", error.response?.data)

      let errorMessage = "Failed to verify payment"

      if (error.response?.data) {
        const errorData = error.response.data
        if (typeof errorData === "string") {
          errorMessage = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.meta?.nextStep) {
          errorMessage = `${errorData.message || "Payment error"}: ${errorData.meta.nextStep}`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      return rejectWithValue(errorMessage)
    }
  }
)

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentPayment = action.payload.payment
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.payment) {
          state.currentPayment = action.payload.payment
          const existingIndex = state.payments.findIndex((p) => p._id === action.payload.payment._id)
          if (existingIndex !== -1) {
            state.payments[existingIndex] = action.payload.payment
          } else {
            state.payments.push(action.payload.payment)
          }
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearCurrentPayment } = paymentSlice.actions
export default paymentSlice.reducer