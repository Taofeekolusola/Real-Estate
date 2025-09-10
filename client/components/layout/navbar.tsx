"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { logout } from "@/store/slices/authSlice"
import { Building2, User, LogOut, Home, FileText, MessageSquare, Star, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }

  const getDashboardLink = () => {
    if (!user) return "/"
    switch (user.role) {
      case "admin":
        return "/admin"
      case "landlord":
        return "/landlord"
      case "tenant":
        return "/tenant"
      default:
        return "/"
    }
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center min-w-0 flex-1">
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <Building2 className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <span className="text-xl font-bold text-gray-900 truncate">RentEase</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {user ? (
              <>
                <Link href="/properties">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Properties</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 max-w-[200px]">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        <span className="hidden sm:inline">{user.name}</span>
                        <span className="sm:hidden">{user.name?.split(' ')[0] || user.name}</span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.role === "tenant" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/tenant/bookings" className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>My Bookings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/tenant/disputes" className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Disputes</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {user.role === "landlord" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/landlord/properties" className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>My Properties</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/landlord/bookings" className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Bookings</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/landlord/ratings" className="flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>Ratings</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <span className="hidden sm:inline">Login</span>
                    <span className="sm:hidden">Sign In</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-sm">
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}