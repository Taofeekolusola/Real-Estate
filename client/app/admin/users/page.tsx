// "use client"

// import { useEffect, useState } from "react"
// import { useAppDispatch, useAppSelector } from "@/hooks/redux"
// import { fetchAllUsers, updateUserStatus } from "@/store/slices/adminSlice"
// import { AuthGuard } from "@/components/auth/auth-guard"
// import { Navbar } from "@/components/layout/navbar"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Users, UserCheck, UserX } from "lucide-react"
// import { toast } from "sonner"

// export default function AdminUsers() {
//   const dispatch = useAppDispatch()
//   const { users, isLoading } = useAppSelector((state) => state.admin)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [roleFilter, setRoleFilter] = useState("all")
//   const [statusFilter, setStatusFilter] = useState("all")

//   useEffect(() => {
//     dispatch(fetchAllUsers())
//   }, [dispatch])

//   const handleStatusUpdate = async (userId: string, status: string) => {
//     try {
//       await dispatch(updateUserStatus({ userId, status })).unwrap()
//       toast.success(`User ${status === "active" ? "activated" : "suspended"} successfully`)
//     } catch (error) {
//       toast.error("Failed to update user status")
//     }
//   }

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesRole = roleFilter === "all" || user.role === roleFilter
//     const matchesStatus = statusFilter === "all" || user.status === statusFilter

//     return matchesSearch && matchesRole && matchesStatus
//   })

//   const getStatusBadge = (status: string) => {
//     return status === "active" ? (
//       <Badge variant="default" className="bg-green-100 text-green-800">
//         <UserCheck className="h-3 w-3 mr-1" />
//         Active
//       </Badge>
//     ) : (
//       <Badge variant="destructive" className="bg-red-100 text-red-800">
//         <UserX className="h-3 w-3 mr-1" />
//         Suspended
//       </Badge>
//     )
//   }

//   const getRoleBadge = (role: string) => {
//     const colors = {
//       tenant: "bg-blue-100 text-blue-800",
//       landlord: "bg-purple-100 text-purple-800",
//       admin: "bg-orange-100 text-orange-800",
//     }

//     return (
//       <Badge variant="outline" className={colors[role as keyof typeof colors]}>
//         {role.charAt(0).toUpperCase() + role.slice(1)}
//       </Badge>
//     )
//   }

//   return (
//     <AuthGuard allowedRoles={["admin"]}>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
//             <p className="text-gray-600">Manage user accounts and permissions</p>
//           </div>

//           {/* Filters */}
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Search className="h-5 w-5" />
//                 <span>Search & Filter Users</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     placeholder="Search by name or email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>

//                 <Select value={roleFilter} onValueChange={setRoleFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Filter by role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Roles</SelectItem>
//                     <SelectItem value="tenant">Tenant</SelectItem>
//                     <SelectItem value="landlord">Landlord</SelectItem>
//                     <SelectItem value="admin">Admin</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="suspended">Suspended</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Users List */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Users className="h-5 w-5" />
//                 <span>Users ({filteredUsers.length})</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="space-y-4">
//                   {[...Array(5)].map((_, i) => (
//                     <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
//                       <div className="flex items-center space-x-4">
//                         <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                         <div className="space-y-2">
//                           <div className="h-4 bg-gray-200 rounded w-32"></div>
//                           <div className="h-3 bg-gray-200 rounded w-48"></div>
//                         </div>
//                       </div>
//                       <div className="h-8 bg-gray-200 rounded w-20"></div>
//                     </div>
//                   ))}
//                 </div>
//               ) : filteredUsers.length > 0 ? (
//                 <div className="space-y-4">
//                   {filteredUsers.map((user) => (
//                     <div
//                       key={user._id}
//                       className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
//                     >
//                       <div className="flex items-center space-x-4">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <span className="text-blue-600 font-semibold">{user.name.charAt(0).toUpperCase()}</span>
//                         </div>
//                         <div>
//                           <div className="flex items-center space-x-2 mb-1">
//                             <h3 className="font-semibold text-gray-900">{user.name}</h3>
//                             {getRoleBadge(user.role)}
//                             {getStatusBadge(user.status)}
//                           </div>
//                           <p className="text-sm text-gray-600">{user.email}</p>
//                           <p className="text-xs text-gray-500">{user.phone}</p>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-2">
//                         {user.role !== "admin" && (
//                           <>
//                             {user.status === "active" ? (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleStatusUpdate(user._id, "suspended")}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <UserX className="h-4 w-4 mr-1" />
//                                 Suspend
//                               </Button>
//                             ) : (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleStatusUpdate(user._id, "active")}
//                                 className="text-green-600 hover:text-green-700"
//                               >
//                                 <UserCheck className="h-4 w-4 mr-1" />
//                                 Activate
//                               </Button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
//                   <p className="text-gray-600">No users match your current filters</p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </AuthGuard>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchAllUsers, updateUserStatus } from "@/store/slices/adminSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, UserCheck, UserX } from "lucide-react"
import { toast } from "sonner"
import { User as IUser} from "@/types"

// interface IUser {
//   _id: string
//   name: string
//   email: string
//   phone?: string
//   role: "tenant" | "landlord" | "admin"
//   status: "active" | "suspended"
// }

export default function AdminUsers() {
  const dispatch = useAppDispatch()
  const { users, isLoading } = useAppSelector((state) => state.admin)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "tenant" | "landlord" | "admin">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all")

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const handleStatusUpdate = async (userId: string, status: "active" | "suspended") => {
    try {
      await dispatch(updateUserStatus({ userId, status })).unwrap()
      toast.success(`User ${status === "active" ? "activated" : "suspended"} successfully`)
    } catch (error) {
      toast.error("Failed to update user status")
    }
  }

  const filteredUsers = users.filter((user: IUser) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (status: IUser["status"]) =>
    status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
        <UserCheck className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-100 text-red-800 flex items-center gap-1">
        <UserX className="h-3 w-3" />
        Suspended
      </Badge>
    )

  const getRoleBadge = (role: IUser["role"]) => {
    const colors: Record<IUser["role"], string> = {
      tenant: "bg-blue-100 text-blue-800",
      landlord: "bg-purple-100 text-purple-800",
      admin: "bg-orange-100 text-orange-800",
    }

    return (
      <Badge variant="outline" className={`${colors[role]} uppercase`}>
        {role}
      </Badge>
    )
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search & Filter Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Users ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-48" />
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20" />
                    </div>
                  ))}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {user.role !== "admin" && (
                          <>
                            {user.status === "active" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(user._id, "suspended")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate(user._id, "active")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                  <p className="text-gray-600">No users match your current filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
