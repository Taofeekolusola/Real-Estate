// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
// import api from "@/lib/api"
// import type { AuthState, LoginCredentials, RegisterData } from "@/types"

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: false,
//   error: null,
// }

// // Async thunks
// export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
//   try {
//     const response = await api.post("/auth/login", credentials)
//     const { token, user } = response.data

//     localStorage.setItem("token", token)
//     localStorage.setItem("user", JSON.stringify(user))

//     return { token, user }
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Login failed")
//   }
// })

// export const registerUser = createAsyncThunk("auth/register", async (userData: RegisterData, { rejectWithValue }) => {
//   try {
//     const response = await api.post("/auth/register", userData)
//     const { token, user } = response.data

//     localStorage.setItem("token", token)
//     localStorage.setItem("user", JSON.stringify(user))

//     return { token, user }
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || "Registration failed")
//   }
// })

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null
//       state.token = null
//       state.error = null
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//     },
//     clearError: (state) => {
//       state.error = null
//     },
//     loadUserFromStorage: (state) => {
//       const token = localStorage.getItem("token")
//       const user = localStorage.getItem("user")

//       if (token && user) {
//         state.token = token
//         state.user = JSON.parse(user)
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.user = action.payload.user
//         state.token = action.payload.token
//         state.error = null
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.user = action.payload.user
//         state.token = action.payload.token
//         state.error = null
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const { logout, clearError, loadUserFromStorage } = authSlice.actions
// export default authSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "@/lib/api"
import type { AuthState, LoginCredentials, RegisterData } from "@/types"

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      return { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (token && user) {
        state.token = token
        state.user = JSON.parse(user)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, loadUserFromStorage } = authSlice.actions
export default authSlice.reducer