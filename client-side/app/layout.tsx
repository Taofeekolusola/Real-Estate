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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self' https://checkout.paystack.com https://js.paystack.co;"
        />
        <meta name="referrer" content="origin-when-cross-origin" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
