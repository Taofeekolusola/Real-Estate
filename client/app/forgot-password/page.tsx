"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Building2, ArrowLeft } from "lucide-react"
import api from "@/lib/api"

const images = ["/images/2d3.jpeg", "/images/2d2.jpeg", "/images/2d12.jpeg", "/images/2d13.jpeg", "/images/house8.jpeg"]

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [currentImage, setCurrentImage] = useState(0)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            // Call the backend to get a reset token (but we won't send email)
            const response = await api.post("/auth/request-reset", { email })
            const { token } = response.data
            // Redirect to reset password page with the token
            router.push(`/reset-password?token=${token}`)
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to proceed with password reset. Please try again.")
        } finally {
            setIsLoading(false)
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

                {/* Right side - Forgot Password Form */}
                <div className="flex-1 flex items-center justify-center bg-gray-800 p-6">
                    <Card className="w-full max-w-md bg-gray-800/90 text-white rounded-2xl shadow-lg">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Building2 className="h-8 w-8 text-blue-500" />
                                <span className="text-2xl font-bold">RentEase</span>
                            </div>
                            <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                            <CardDescription className="text-gray-400">
                                Enter your email address to proceed with password reset
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
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                        className="bg-gray-700 text-white placeholder-gray-400"
                                    />
                                </div>

                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                    {isLoading ? "Processing..." : "Reset Password"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center space-y-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-sm text-blue-400 hover:underline font-medium"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Sign In
                                </Link>
                                <p className="text-sm text-gray-400">
                                    Remember your password?{" "}
                                    <Link href="/login" className="text-blue-400 hover:underline font-medium">
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
