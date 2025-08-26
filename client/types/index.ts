export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: "tenant" | "landlord" | "admin"
  nin?: string
  bvn?: string
  status?: "active" | "suspended"
  createdAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface Property {
  _id: string
  title: string
  description?: string
  address: string
  rentAmount: number
  paymentOptions?: string[]
  agencyFee?: number
  legalFee?: number
  agreementUrl?: string
  durationInMonths?: number
  images?: string[]
  landlord?: User
  approved?: boolean
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface Booking {
  _id: string
  property: Property
  tenant: User
  landlord: User
  message: string
  status: "pending" | "approved" | "rejected"
  inspectionDate?: string
  createdAt: string
}

export interface Payment {
  _id: string
  booking: Booking
  amount: number
  reference: string
  status: "pending" | "success" | "failed"
  paymentUrl?: string
  createdAt: string
}

export interface Dispute {
  _id: string
  againstUser: User
  property: Property
  description: string
  status: "pending" | "in-progress" | "resolved"
  assignedTo?: User
  resolutionNote?: string
  createdBy: User
  createdAt: string
}

export interface Rating {
  _id: string
  landlord: User
  tenant: User
  rating: number
  comment: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: "tenant" | "landlord"
  // nin: string
  // bvn: string
}