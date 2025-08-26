"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { registerUser, clearError } from "@/store/slices/authSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Building2, Eye, EyeOff, User, Home } from "lucide-react"

const images = ["/images/2d3.jpeg", "/images/2d2.jpeg", "/images/2d12.jpeg", "/images/2d13.jpeg", "/images/house8.jpeg"]

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant" as "tenant" | "landlord",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const { isLoading, error } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) dispatch(clearError())
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "tenant" | "landlord" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) return

    const { confirmPassword, ...submitData } = formData
    const result = await dispatch(registerUser(submitData))
    if (registerUser.fulfilled.match(result)) {
      const user = result.payload.user
      const dashboardRoute = user.role === "landlord" ? "/landlord" : "/tenant"
      router.push(dashboardRoute)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Carousel Section */}
        <div className="relative hidden md:block overflow-hidden">
          <AnimatePresence>
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt="Rental showcase"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className="hidden md:flex md:w-1/2 relative">
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center mt-6 text-center px-8 text-white">
              <Building2 className="h-40 w-40 mb-2.5 text-white-500" />
              <h1 className="text-4xl font-bold mb-4">Welcome to RentEase</h1>
              <p className="text-lg max-w-md">
                Find your perfect home or manage your properties with ease.
              </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
        </div>

        {/* Form Section */}
        <div className="flex items-center justify-center p-6 bg-gray-800">
          <Card className="w-full max-w-md shadow-2xl rounded-2xl bg-gray-800/90 text-white">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold">RentEase</span>
              </div>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription className="text-gray-400">
                Join our platform to start your rental journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>I am a</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    className="flex space-x-6"
                  >
                    <RadioGroupItem
                      value="tenant"
                      id="tenant"
                      className="hidden"
                    />
                    <Label
                      htmlFor="tenant"
                      className={`cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-md 
                      ${formData.role === "tenant" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                    >
                      <User className="h-4 w-4" />
                      <span>Tenant</span>
                    </Label>

                    <RadioGroupItem
                      value="landlord"
                      id="landlord"
                      className="hidden"
                    />
                    <Label
                      htmlFor="landlord"
                      className={`cursor-pointer flex items-center space-x-2 px-3 py-2 rounded-md 
                      ${formData.role === "landlord" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                    >
                      <Home className="h-4 w-4" />
                      <span>Landlord</span>
                    </Label>
                  </RadioGroup>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-300 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="08012345678"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="bg-gray-300 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-300 text-white placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-gray-300 text-white placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-300" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-gray-300 text-white placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-300" />
                      )}
                    </Button>
                  </div>
                  {formData.password !== formData.confirmPassword &&
                    formData.confirmPassword && (
                      <p className="text-sm text-red-500">
                        Passwords do not match
                      </p>
                    )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={
                    isLoading || formData.password !== formData.confirmPassword
                  }
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AuthGuard>
  )
}