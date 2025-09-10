"use client"

export const dynamic = "force-dynamic"
import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Building2, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"
import api from "@/lib/api"

const images = ["/images/2d3.jpeg", "/images/2d2.jpeg", "/images/2d12.jpeg", "/images/2d13.jpeg", "/images/house8.jpeg"]

function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [token, setToken] = useState("")
    const [currentImage, setCurrentImage] = useState(0)

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const tokenParam = searchParams.get("token")
        if (tokenParam) {
            setToken(tokenParam)
        } else {
            setError("Invalid or missing reset token. Please request a new password reset.")
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const validatePassword = (password: string) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const minLength = password.length >= 8
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)

        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.")
            setIsLoading(false)
            return
        }

        // Validate password strength
        const passwordValidation = validatePassword(formData.newPassword)
        if (!passwordValidation.isValid) {
            setError("Password must be at least 8 characters long and contain uppercase, lowercase, and numbers.")
            setIsLoading(false)
            return
        }

        try {
            await api.post("/auth/reset", {
                token,
                newPassword: formData.newPassword
            })
            setSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to reset password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
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

                    {/* Right side - Success Message */}
                    <div className="flex-1 flex items-center justify-center bg-gray-800 p-6">
                        <Card className="w-full max-w-md bg-gray-800/90 text-white rounded-2xl shadow-lg">
                            <CardHeader className="text-center">
                                <div className="flex items-center justify-center space-x-2 mb-4">
                                    <Building2 className="h-8 w-8 text-blue-500" />
                                    <span className="text-2xl font-bold">RentEase</span>
                                </div>
                                <CardTitle className="text-2xl">Password Reset Successful!</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Your password has been successfully reset
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="flex justify-center mb-6">
                                    <CheckCircle className="h-16 w-16 text-green-500" />
                                </div>
                                <Alert className="border-green-500 bg-green-500/10 mb-6">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription className="text-green-400">
                                        Your password has been reset successfully. You will be redirected to the login page shortly.
                                    </AlertDescription>
                                </Alert>
                                <Link href="/login">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Go to Sign In
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AuthGuard>
        )
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

                {/* Right side - Reset Password Form */}
                <div className="flex-1 flex items-center justify-center bg-gray-800 p-6">
                    <Card className="w-full max-w-md bg-gray-800/90 text-white rounded-2xl shadow-lg">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Building2 className="h-8 w-8 text-blue-500" />
                                <span className="text-2xl font-bold">RentEase</span>
                            </div>
                            <CardTitle className="text-2xl">Reset Password</CardTitle>
                            <CardDescription className="text-gray-400">
                                Enter your new password below
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
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            required
                                            className="bg-gray-700 text-white placeholder-gray-400"
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
                                    {formData.newPassword && (
                                        <div className="text-xs text-gray-400 space-y-1">
                                            <div className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                                                <span className="mr-1">{formData.newPassword.length >= 8 ? '✓' : '✗'}</span>
                                                At least 8 characters
                                            </div>
                                            <div className={`flex items-center ${/[A-Z]/.test(formData.newPassword) ? 'text-green-400' : 'text-red-400'}`}>
                                                <span className="mr-1">{/[A-Z]/.test(formData.newPassword) ? '✓' : '✗'}</span>
                                                One uppercase letter
                                            </div>
                                            <div className={`flex items-center ${/[a-z]/.test(formData.newPassword) ? 'text-green-400' : 'text-red-400'}`}>
                                                <span className="mr-1">{/[a-z]/.test(formData.newPassword) ? '✓' : '✗'}</span>
                                                One lowercase letter
                                            </div>
                                            <div className={`flex items-center ${/\d/.test(formData.newPassword) ? 'text-green-400' : 'text-red-400'}`}>
                                                <span className="mr-1">{/\d/.test(formData.newPassword) ? '✓' : '✗'}</span>
                                                One number
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="bg-gray-700 text-white placeholder-gray-400"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-300" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-300" />
                                            )}
                                        </Button>
                                    </div>
                                    {formData.confirmPassword && (
                                        <div className={`text-xs ${formData.newPassword === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                            {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={isLoading || !token}
                                >
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center text-sm text-blue-400 hover:underline font-medium"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}

function LoadingFallback() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="min-h-screen grid md:grid-cols-2">
                {/* Carousel Section */}
                <div className="relative hidden md:block overflow-hidden">
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

                {/* Right side - Loading */}
                <div className="flex-1 flex items-center justify-center bg-gray-800 p-6">
                    <Card className="w-full max-w-md bg-gray-800/90 text-white rounded-2xl shadow-lg">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Building2 className="h-8 w-8 text-blue-500" />
                                <span className="text-2xl font-bold">RentEase</span>
                            </div>
                            <CardTitle className="text-2xl">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordForm />
        </Suspense>
    )
}
