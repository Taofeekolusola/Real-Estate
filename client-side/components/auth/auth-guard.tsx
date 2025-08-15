"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { loadUserFromStorage, logout } from "@/store/slices/authSlice"
import api from "@/lib/api" // axios instance

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: ("tenant" | "landlord" | "admin")[]
}

export function AuthGuard({ children, requireAuth = true, allowedRoles }: AuthGuardProps) {
  const { user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!token) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, token])

  useEffect(() => {
    const verifyToken = async () => {
      if (requireAuth) {
        if (!token) {
          router.push("/login")
          return
        }
        try {
          const res = await api.get("/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          })
          // Optionally update Redux with latest user data
          // dispatch(setUser(res.data.user))
        } catch {
          dispatch(logout())
          router.push("/login")
          return
        }
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }

      if (!requireAuth && token) {
        const dashboardRoute =
          user?.role === "admin"
            ? "/admin"
            : user?.role === "landlord"
            ? "/landlord"
            : "/tenant"
        router.push(dashboardRoute)
        return
      }

      setVerifying(false)
    }

    verifyToken()
  }, [token, user, requireAuth, allowedRoles, router, dispatch])

  if (verifying) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <>{children}</>
}