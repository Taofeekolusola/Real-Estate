"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchAllUsers, fetchAllProperties, fetchAllDisputes } from "@/store/slices/adminSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, MessageSquare, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { stats, isLoading } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllUsers())
    dispatch(fetchAllProperties())
    dispatch(fetchAllDisputes())
  }, [dispatch])

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "Registered users",
      href: "/admin/users",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties,
      icon: Building,
      description: "Listed properties",
      href: "/admin/properties",
    },
    {
      title: "Total Disputes",
      value: stats.totalDisputes,
      icon: MessageSquare,
      description: "Active disputes",
      href: "/admin/disputes",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertTriangle,
      description: "Properties awaiting approval",
      href: "/admin/properties",
    },
  ]

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, properties, and disputes</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{isLoading ? "..." : stat.value}</div>
                    <p className="text-xs text-gray-500 mb-3">{stat.description}</p>
                    <Link href={stat.href}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Property Management</span>
                </CardTitle>
                <CardDescription>Review and approve property listings</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/properties">
                  <Button className="w-full">Manage Properties</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Dispute Resolution</span>
                </CardTitle>
                <CardDescription>Handle disputes and assign mediators</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/disputes">
                  <Button className="w-full">Manage Disputes</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
