import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>You don't have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Go Home</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}