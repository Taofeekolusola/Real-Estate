"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { fetchUserDisputes, deleteDispute } from "@/store/slices/disputeSlice"
import { fetchProperties } from "@/store/slices/propertySlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreateDisputeDialog } from "@/components/dispute/create-dispute-dialog"
import { MessageSquare, Plus, Clock, User, Building2, AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function TenantDisputesPage() {
  const dispatch = useAppDispatch()
  const { disputes, isLoading, error } = useAppSelector((state) => state.dispute)
  const { properties } = useAppSelector((state) => state.property)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchUserDisputes())
    dispatch(fetchProperties())
  }, [dispatch])

  const handleDeleteDispute = async (disputeId: string) => {
    if (!confirm("Are you sure you want to delete this dispute? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[v0] Deleting dispute:", disputeId)
      await dispatch(deleteDispute(disputeId)).unwrap()
      await dispatch(fetchUserDisputes())
      toast.success("Dispute deleted successfully")
    } catch (error) {
      console.error("[v0] Failed to delete dispute:", error)
      toast.error("Failed to delete dispute")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default"
      case "in-progress":
        return "secondary"
      // case "pending":
      //   return "warning"
      case "rejected":
        return "destructive"
      default:
        return "destructive"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <AuthGuard allowedRoles={["tenant"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Disputes</h1>
              <p className="text-gray-600">Manage your property-related disputes</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Dispute</span>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : disputes.length > 0 ? (
            <div className="space-y-6">
              {disputes.map((dispute) => (
                <Card key={dispute._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5" />
                          <span>Dispute #{dispute._id.slice(-6)}</span>
                        </CardTitle>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-2" />
                          <span>{dispute.property.title}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Against: {dispute.againstUser.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                        {dispute.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDispute(dispute._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                        <p className="text-gray-600">{dispute.description}</p>
                      </div>

                      {dispute.resolutionNote && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-800 mb-2">Resolution:</p>
                          <p className="text-green-700">{dispute.resolutionNote}</p>
                        </div>
                      )}

                      {dispute.assignedTo && (
                        <div className="flex items-center text-sm text-blue-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Assigned to: {dispute.assignedTo.name}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Created on {formatDate(dispute.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disputes</h3>
                <p className="text-gray-600 mb-4">You haven't created any disputes yet</p>
                <Button onClick={() => setShowCreateDialog(true)}>Create Dispute</Button>
              </CardContent>
            </Card>
          )}

          <CreateDisputeDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} properties={properties} />
        </div>
      </div>
    </AuthGuard>
  )
}
