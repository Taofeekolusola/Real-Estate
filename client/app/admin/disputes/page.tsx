"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchAllDisputes, assignMediator, updateDisputeStatus, deleteDispute } from "@/store/slices/adminSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, MessageSquare, Clock, AlertTriangle, CheckCircle, User as UserIcon, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {User}  from "@/types"

export default function AdminDisputes() {
  const dispatch = useAppDispatch()
  const { disputes, users, isLoading } = useAppSelector((state) => state.admin)
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDispute, setSelectedDispute] = useState<any>(null)
  const [mediatorId, setMediatorId] = useState("")
  const [resolutionNote, setResolutionNote] = useState("")

  useEffect(() => {
    dispatch(fetchAllDisputes())
  }, [dispatch])

  const handleAssignMediator = async () => {
    if (!selectedDispute || !mediatorId) return

    try {
      console.log("[v0] Assigning mediator to dispute:", selectedDispute._id)
      await dispatch(
        assignMediator({
          disputeId: selectedDispute._id,
          assignedTo: mediatorId,
        }),
      ).unwrap()

      await dispatch(fetchAllDisputes())

      toast.success("Mediator assigned successfully")
      setSelectedDispute(null)
      setMediatorId("")
    } catch (error) {
      console.error("[v0] Failed to assign mediator:", error)
      toast.error("Failed to assign mediator")
    }
  }

  const handleResolveDispute = async () => {
    if (!selectedDispute || !resolutionNote) return

    try {
      console.log("[v0] Resolving dispute:", selectedDispute._id)
      await dispatch(
        updateDisputeStatus({
          disputeId: selectedDispute._id,
          status: "resolved",
          resolutionNote,
        }),
      ).unwrap()

      await dispatch(fetchAllDisputes())

      toast.success("Dispute resolved successfully")
      setSelectedDispute(null)
      setResolutionNote("")
    } catch (error) {
      console.error("[v0] Failed to resolve dispute:", error)
      toast.error("Failed to resolve dispute")
    }
  }

  const handleSelfAssign = async (dispute: any) => {
    if (!user || dispute.status !== "pending") return

    try {
      console.log("[v0] Self-assigning mediator to dispute:", dispute._id)
      await dispatch(
        assignMediator({
          disputeId: dispute._id,
          assignedTo: user._id,
        }),
      ).unwrap()

      await dispatch(fetchAllDisputes())
      toast.success("You have been assigned as mediator for this dispute")
    } catch (error) {
      console.error("[v0] Failed to self-assign as mediator:", error)
      toast.error("Failed to assign yourself as mediator")
    }
  }

  const handleDeleteDispute = async (disputeId: string) => {
    if (!confirm("Are you sure you want to delete this dispute? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[v0] Deleting dispute:", disputeId)
      await dispatch(deleteDispute(disputeId)).unwrap()
      await dispatch(fetchAllDisputes())
      toast.success("Dispute deleted successfully")
    } catch (error) {
      console.error("[v0] Failed to delete dispute:", error)
      toast.error("Failed to delete dispute")
    }
  }

  const filteredDisputes = (disputes || []).filter((dispute) => {
    const createdByName = dispute.createdBy?.name || "Unknown User"
    const againstUserName = dispute.againstUser?.name || "Unknown User"

    const matchesSearch =
      dispute.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      createdByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      againstUserName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || dispute.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    if (!["pending", "in-progress", "resolved"].includes(status)) {
      console.warn("[v0] Unknown dispute status detected:", status)
    }

    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Pending" },
      "in-progress": { color: "bg-blue-100 text-blue-800", icon: AlertTriangle, text: "In Progress" },
      resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Resolved" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-red-100 text-red-800",
      icon: AlertTriangle,
      text: `Invalid (${status})`,
    }
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const canResolveDispute = (dispute: any) => {
    if (!user) return false

    // Admin can always resolve disputes
    if (user.role === "admin") return true

    // Check if current user is the assigned mediator
    if (dispute.assignedTo && dispute.assignedTo._id === user._id) return true

    return false
  }

  const admins = users.filter((user: User) => user.role === "admin")

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Management</h1>
            <p className="text-gray-600">Handle disputes and assign mediators</p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search & Filter Disputes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search disputes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Disputes List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Disputes ({filteredDisputes.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : filteredDisputes.length > 0 ? (
                <div className="space-y-4">
                  {filteredDisputes.map((dispute) => (
                    <div key={dispute._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {dispute.createdBy?.name || "Unknown User"} vs {dispute.againstUser?.name || "Unknown User"}
                          </h3>
                          {getStatusBadge(dispute.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {dispute.status === "pending" && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedDispute(dispute)}>
                                    <UserIcon className="h-4 w-4 mr-1" />
                                    Assign Mediator
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Assign Mediator</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Select value={mediatorId} onValueChange={setMediatorId}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a mediator" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {admins.map((admin: User) => (
                                          <SelectItem key={admin._id} value={admin._id}>
                                            {admin.name} ({admin.email})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Button onClick={handleAssignMediator} className="w-full">
                                      Assign Mediator
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {user?.role === "admin" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelfAssign(dispute)}
                                  className="bg-blue-50 hover:bg-blue-100"
                                >
                                  Take This Case
                                </Button>
                              )}
                            </>
                          )}

                          {dispute.status === "in-progress" && canResolveDispute(dispute) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedDispute(dispute)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Resolve Dispute</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Textarea
                                    placeholder="Enter resolution note..."
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                    rows={4}
                                  />
                                  <Button onClick={handleResolveDispute} className="w-full">
                                    Mark as Resolved
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {dispute.status === "in-progress" && !canResolveDispute(dispute) && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-600">
                              Assigned to: {dispute.assignedTo?.name || "Another Mediator"}
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDispute(dispute._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Property:</strong> {dispute.property?.title || "Unknown Property"}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Description:</strong> {dispute.description}
                      </p>

                      {dispute.assignedTo && (
                        <p className="text-sm text-blue-600 mb-2">
                          <strong>Assigned to:</strong> {dispute.assignedTo?.name || "Unknown User"}
                        </p>
                      )}

                      {dispute.resolutionNote && (
                        <p className="text-sm text-green-600 mb-2">
                          <strong>Resolution:</strong> {dispute.resolutionNote}
                        </p>
                      )}

                      <p className="text-xs text-gray-500">
                        Created: {new Date(dispute.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disputes Found</h3>
                  <p className="text-gray-600">No disputes match your current filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}