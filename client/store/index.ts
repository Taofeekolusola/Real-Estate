import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import propertyReducer from "./slices/propertySlice"
import bookingReducer from "./slices/bookingSlice"
import paymentReducer from "./slices/paymentSlice"
import disputeReducer from "./slices/disputeSlice"
import ratingReducer from "./slices/ratingSlice"
import adminReducer from "./slices/adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    dispute: disputeReducer,
    rating: ratingReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})