// import type React from "react"
// import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
// import "./globals.css"
// import { ReduxProvider } from "@/components/providers/redux-provider"

// export const metadata: Metadata = {
//   title: "RentEase - Property Rental Platform",
//   description: "Connect landlords and tenants seamlessly",
//   generator: "v0.app",
// }

// // ✅ Fonts must be defined at module scope
// const geistSans = GeistSans
// const geistMono = GeistMono

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
//       <head>
//         <meta
//           httpEquiv="Content-Security-Policy"
//           content="frame-ancestors 'self' https://checkout.paystack.com https://js.paystack.co;"
//         />
//         <meta name="referrer" content="origin-when-cross-origin" />
//       </head>
//       <body className="font-sans">
//         <ReduxProvider>{children}</ReduxProvider>
//       </body>
//     </html>
//   )
// }

import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"

export const metadata: Metadata = {
  title: "RentEase - Property Rental Platform",
  description: "Connect landlords and tenants seamlessly",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.paystack.co;"
        />
        <meta name="referrerPolicy" content="origin-when-cross-origin" />
      </head>
      <body className="font-sans">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}