"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { loadUserFromStorage } from "@/store/slices/authSlice"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: ("tenant" | "landlord" | "admin")[]
}

export function AuthGuard({ children, requireAuth = true, allowedRoles }: AuthGuardProps) {
  const { user, token } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    if (!user && !token) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, user, token])

  useEffect(() => {
    if (requireAuth && !token) {
      router.push("/login")
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized")
      return
    }

    if (!requireAuth && token) {
      // Redirect authenticated users away from auth pages
      const dashboardRoute = user?.role === "admin" ? "/admin" : user?.role === "landlord" ? "/landlord" : "/tenant"
      router.push(dashboardRoute)
    }
  }, [user, token, requireAuth, allowedRoles, router])

  if (requireAuth && !token) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>
  }

  return <>{children}</>
}